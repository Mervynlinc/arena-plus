import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@clerk/expo';
import * as Notifications from 'expo-notifications';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Platform } from 'react-native';
import type { Match } from '@/lib/api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationPreferences {
  matchRemindersEnabled: boolean;
}

export type MatchReminderUpdateResult =
  | 'success'
  | 'permission-denied'
  | 'too-late'
  | 'error';

interface NotificationContextValue {
  preferences: NotificationPreferences;
  preferencesLoaded: boolean;
  updatingPreference: boolean;
  updatingMatchId: string | null;
  enabledMatchReminders: ReadonlySet<string>;
  error: string | null;
  notification: Notifications.Notification | null;
  response: Notifications.NotificationResponse | null;
  setMatchRemindersEnabled: (value: boolean) => Promise<boolean>;
  setMatchReminder: (
    match: Match,
    value: boolean
  ) => Promise<MatchReminderUpdateResult>;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  matchRemindersEnabled: false,
};

const PREFERENCES_STORAGE_PREFIX = '@streamed/notification-preferences/';
const MATCH_REMINDER_STORAGE_PREFIX = '@streamed/match-reminder/';
const MATCH_REMINDER_LEAD_TIME = 10 * 60 * 1000;

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

function getPreferencesStorageKey(userId: string) {
  return `${PREFERENCES_STORAGE_PREFIX}${userId}`;
}

function getMatchReminderStoragePrefix(userId: string) {
  return `${MATCH_REMINDER_STORAGE_PREFIX}${userId}:`;
}

function getMatchReminderStorageKey(userId: string, matchId: string) {
  return `${getMatchReminderStoragePrefix(userId)}${encodeURIComponent(matchId)}`;
}

function getMatchIdFromStorageKey(key: string, userId: string) {
  const prefix = getMatchReminderStoragePrefix(userId);
  if (!key.startsWith(prefix)) return null;

  const encodedMatchId = key.slice(prefix.length);
  try {
    return decodeURIComponent(encodedMatchId);
  } catch {
    return encodedMatchId;
  }
}

function parsePreferences(value: string | null): NotificationPreferences {
  if (!value) return DEFAULT_PREFERENCES;

  try {
    const parsed = JSON.parse(value) as Partial<NotificationPreferences>;
    return {
      matchRemindersEnabled: parsed.matchRemindersEnabled === true,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function formatSportName(category: string) {
  const names: Record<string, string> = {
    afl: 'AFL',
    'american-football': 'American Football',
    'motor-sports': 'Motor Sports',
  };

  return (
    names[category] ??
    category.replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}

async function ensureNotificationPermission() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('match-reminders', {
      name: 'Match reminders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#CFFF3D',
    });
  }

  const existingPermission = await Notifications.getPermissionsAsync();
  if (existingPermission.granted) return true;
  if (!existingPermission.canAskAgain) return false;

  const requestedPermission = await Notifications.requestPermissionsAsync();
  return requestedPermission.granted;
}

async function loadEnabledMatchReminders(userId: string) {
  const storagePrefix = getMatchReminderStoragePrefix(userId);
  const storageKeys = (await AsyncStorage.getAllKeys()).filter((key) =>
    key.startsWith(storagePrefix)
  );
  const storedEntries =
    storageKeys.length > 0 ? await AsyncStorage.multiGet(storageKeys) : [];
  const storedMatchIds = storedEntries
    .map(([key]) => getMatchIdFromStorageKey(key, userId))
    .filter((matchId): matchId is string => matchId !== null);

  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const scheduledMatchIds = scheduledNotifications
    .filter(
      (scheduledNotification) =>
        scheduledNotification.content.data?.type === 'match-reminder' &&
        scheduledNotification.content.data?.userId === userId
    )
    .map(
      (scheduledNotification) => scheduledNotification.content.data?.matchId as string
    )
    .filter(Boolean);

  return new Set([...storedMatchIds, ...scheduledMatchIds]);
}

async function cancelMatchReminders(userId: string, matchId?: string) {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const matchingNotifications = scheduledNotifications.filter(
    (scheduledNotification) =>
      scheduledNotification.content.data?.type === 'match-reminder' &&
      scheduledNotification.content.data?.userId === userId &&
      (!matchId || scheduledNotification.content.data?.matchId === matchId)
  );

  await Promise.all(
    matchingNotifications.map((scheduledNotification) =>
      Notifications.cancelScheduledNotificationAsync(scheduledNotification.identifier)
    )
  );

  const storageKeys = (await AsyncStorage.getAllKeys()).filter((key) => {
    if (!key.startsWith(getMatchReminderStoragePrefix(userId))) return false;
    return matchId ? getMatchIdFromStorageKey(key, userId) === matchId : true;
  });
  if (storageKeys.length > 0) await AsyncStorage.multiRemove(storageKeys);
}

async function clearAllMatchReminders() {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const matchingNotifications = scheduledNotifications.filter(
    (scheduledNotification) =>
      scheduledNotification.content.data?.type === 'match-reminder'
  );

  await Promise.all(
    matchingNotifications.map((scheduledNotification) =>
      Notifications.cancelScheduledNotificationAsync(scheduledNotification.identifier)
    )
  );

  const storageKeys = (await AsyncStorage.getAllKeys()).filter((key) =>
    key.startsWith(MATCH_REMINDER_STORAGE_PREFIX)
  );
  if (storageKeys.length > 0) await AsyncStorage.multiRemove(storageKeys);
}

async function scheduleMatchReminder(match: Match, userId: string) {
  const reminderDate = new Date(match.date - MATCH_REMINDER_LEAD_TIME);
  if (reminderDate.getTime() <= Date.now()) return false;

  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const alreadyScheduled = scheduledNotifications.some(
    (scheduledNotification) =>
      scheduledNotification.content.data?.type === 'match-reminder' &&
      scheduledNotification.content.data?.matchId === match.id &&
      scheduledNotification.content.data?.userId === userId
  );
  if (alreadyScheduled) return true;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: formatSportName(match.category),
      body: `${match.title} is starting in 10 minutes`,
      sound: true,
      data: {
        type: 'match-reminder',
        matchId: match.id,
        userId,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate,
      channelId: 'match-reminders',
    },
  });

  return true;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded: userLoaded } = useUser();
  const userId = user?.id;
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [updatingPreference, setUpdatingPreference] = useState(false);
  const [updatingMatchId, setUpdatingMatchId] = useState<string | null>(null);
  const [enabledMatchReminders, setEnabledMatchReminders] =
    useState<ReadonlySet<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [response, setResponse] = useState<Notifications.NotificationResponse | null>(null);

  useEffect(() => {
    let active = true;

    if (!userLoaded) return;

    if (!userId) {
      setPreferences(DEFAULT_PREFERENCES);
      setEnabledMatchReminders(new Set());
      setPreferencesLoaded(true);
      setError(null);
      return;
    }

    setPreferencesLoaded(false);
    setError(null);
    Promise.all([
      AsyncStorage.getItem(getPreferencesStorageKey(userId)),
      loadEnabledMatchReminders(userId),
    ])
      .then(([storedPreferences, storedMatchReminders]) => {
        if (!active) return;
        const nextPreferences = parsePreferences(storedPreferences);
        setPreferences(nextPreferences);
        setEnabledMatchReminders(
          nextPreferences.matchRemindersEnabled ? storedMatchReminders : new Set()
        );
      })
      .catch(() => {
        if (active) setError('Could not load notification settings.');
      })
      .finally(() => {
        if (active) setPreferencesLoaded(true);
      });

    return () => {
      active = false;
    };
  }, [userId, userLoaded]);

  useEffect(() => {
    if (!userLoaded || userId) return;

    clearAllMatchReminders()
      .catch(() => {})
      .finally(() => {
        setEnabledMatchReminders(new Set());
      });
  }, [userId, userLoaded]);

  useEffect(() => {
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (receivedNotification) => setNotification(receivedNotification)
    );
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (notificationResponse) => setResponse(notificationResponse)
    );

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  const setMatchRemindersEnabled = useCallback(
    async (value: boolean) => {
      if (!userId || updatingPreference) return false;

      setUpdatingPreference(true);
      setError(null);

      try {
        if (value) {
          const permissionGranted = await ensureNotificationPermission();
          if (!permissionGranted) {
            setError('Enable notifications in your device settings to use match reminders.');
            return false;
          }
        } else {
          await cancelMatchReminders(userId);
        }

        const nextPreferences = { matchRemindersEnabled: value };
        await AsyncStorage.setItem(
          getPreferencesStorageKey(userId),
          JSON.stringify(nextPreferences)
        );
        setPreferences(nextPreferences);
        if (!value) setEnabledMatchReminders(new Set());
        return true;
      } catch {
        setError('Could not update notification settings. Please try again.');
        return false;
      } finally {
        setUpdatingPreference(false);
      }
    },
    [updatingPreference, userId]
  );

  const setMatchReminder = useCallback(
    async (match: Match, value: boolean): Promise<MatchReminderUpdateResult> => {
      if (
        !userId ||
        !preferences.matchRemindersEnabled ||
        updatingMatchId
      ) {
        return 'error';
      }
      if (value && match.date - Date.now() <= MATCH_REMINDER_LEAD_TIME) {
        return 'too-late';
      }

      setUpdatingMatchId(match.id);

      try {
        if (value) {
          const permissionGranted = await ensureNotificationPermission();
          if (!permissionGranted) return 'permission-denied';

          const scheduled = await scheduleMatchReminder(match, userId);
          if (!scheduled) return 'too-late';

          try {
            await AsyncStorage.setItem(
              getMatchReminderStorageKey(userId, match.id),
              'enabled'
            );
          } catch (error) {
            await cancelMatchReminders(userId, match.id).catch(() => {});
            throw error;
          }
          setEnabledMatchReminders(
            new Set([...enabledMatchReminders, match.id])
          );
        } else {
          await cancelMatchReminders(userId, match.id);
          const nextMatchReminders = new Set(enabledMatchReminders);
          nextMatchReminders.delete(match.id);
          setEnabledMatchReminders(nextMatchReminders);
        }
        return 'success';
      } catch {
        return 'error';
      } finally {
        setUpdatingMatchId(null);
      }
    },
    [enabledMatchReminders, preferences.matchRemindersEnabled, updatingMatchId, userId]
  );

  return (
    <NotificationContext.Provider
      value={{
        preferences,
        preferencesLoaded,
        updatingPreference,
        updatingMatchId,
        enabledMatchReminders,
        error,
        notification,
        response,
        setMatchRemindersEnabled,
        setMatchReminder,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
