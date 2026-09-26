import { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  BellOff,
  TriangleAlert,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';
import StreamRow from '@/components/StreamRow';
import { fetchStreams, posterUrl, badgeUrl, Stream, Match } from '@/lib/api';
import ScreenContainer from '@/components/ScreenContainer';
import StreamRowSkeleton from '@/components/skeletons/StreamRowSkeleton';
import Reveal from '@/components/Reveal';
import CountdownTimer from '@/components/CountdownTimer';
import {
  useNotifications,
  type MatchReminderUpdateResult,
} from '../../../context/NotificationContext';

type ReminderNoticeKind = Exclude<MatchReminderUpdateResult, 'success'>;

const reminderNoticeCopy: Record<
  ReminderNoticeKind,
  { eyebrow: string; title: string; message: string }
> = {
  'permission-denied': {
    eyebrow: 'NOTIFICATIONS ARE OFF',
    title: 'Allow notifications to continue',
    message:
      'Your device is blocking match reminders. Enable notifications in system settings to get a heads-up 10 minutes before kickoff.',
  },
  'too-late': {
    eyebrow: '10-MINUTE WINDOW MISSED',
    title: 'This match is already too close',
    message:
      'Kickoff is 10 minutes away or sooner, so there is not enough time left to schedule a reminder.',
  },
  error: {
    eyebrow: 'REMINDER NOT UPDATED',
    title: 'That did not go through',
    message:
      'We could not update this reminder. Check your connection and try again in a moment.',
  },
};

function MatchReminderNotice({
  kind,
  onClose,
}: {
  kind: ReminderNoticeKind;
  onClose: () => void;
}) {
  const copy = reminderNoticeCopy[kind];
  const isError = kind === 'error';
  const isTooLate = kind === 'too-late';
  const accent = isError ? colors.liveRed : colors.accent;
  const glow = isError ? 'rgba(229, 52, 78, 0.18)' : 'rgba(207, 255, 61, 0.16)';
  const NoticeIcon =
    kind === 'permission-denied' ? BellOff : TriangleAlert;

  return (
    <Modal
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        className="flex-1 items-center justify-center px-7"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.78)' }}
      >
        <Reveal style={{ width: '100%', maxWidth: isTooLate ? 330 : 360 }}>
          <View
            accessibilityViewIsModal
            className="overflow-hidden rounded-[28px] border border-stroke bg-bgCard"
            style={{
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 16 },
              shadowOpacity: 0.45,
              shadowRadius: 28,
              elevation: 18,
            }}
          >
            <View
              className={`items-center px-6 pb-6 ${isTooLate ? 'pt-7' : 'pt-8'}`}
            >
              {!isTooLate ? (
                <>
                  <View
                    className="h-16 w-16 items-center justify-center rounded-[22px] border"
                    style={{
                      backgroundColor: glow,
                      borderColor: isError
                        ? 'rgba(229, 52, 78, 0.34)'
                        : 'rgba(207, 255, 61, 0.3)',
                      shadowColor: accent,
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.2,
                      shadowRadius: 14,
                      elevation: 6,
                    }}
                  >
                    <NoticeIcon color={accent} size={29} strokeWidth={2.1} />
                  </View>

                  <View className="mt-5 rounded-full border border-stroke bg-bgCard2 px-3 py-1.5">
                    <Text className="font-inter font-bold text-[10px] tracking-[1.2px] text-textMuted">
                      {copy.eyebrow}
                    </Text>
                  </View>

                  <Text className="mt-4 text-center font-inter text-[22px] font-bold leading-[28px] text-text">
                    {copy.title}
                  </Text>
                </>
              ) : null}

              <Text
                className={`text-center font-inter font-normal text-textMuted ${
                  isTooLate
                    ? 'text-[15px] leading-[23px]'
                    : 'mt-2 text-[14px] leading-[21px]'
                }`}
              >
                {copy.message}
              </Text>

              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.82}
                onPress={onClose}
                className={`mt-6 w-full items-center justify-center rounded-2xl py-[14px] ${
                  isError ? 'bg-liveRed' : 'bg-accent'
                }`}
              >
                <Text
                  className={`font-inter text-[14px] font-bold ${
                    isError ? 'text-text' : 'text-bg'
                  }`}
                >
                  Got it
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Reveal>
      </View>
    </Modal>
  );
}

function MatchReminderSwitch({
  value,
  disabled,
  onChange,
}: {
  value: boolean;
  disabled: boolean;
  onChange: (value: boolean) => Promise<boolean>;
}) {
  const [progress] = useState(() => new Animated.Value(value ? 1 : 0));
  const [pending, setPending] = useState(false);

  useEffect(() => {
    Animated.spring(progress, {
      toValue: value ? 1 : 0,
      stiffness: 280,
      damping: 26,
      mass: 0.7,
      overshootClamping: true,
      useNativeDriver: true,
    }).start();
  }, [progress, value]);

  const handlePress = async () => {
    if (disabled || pending) return;

    setPending(true);
    try {
      await onChange(!value);
    } finally {
      setPending(false);
    }
  };

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 22],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel="Match reminder"
      accessibilityHint={
        value ? 'Disables the reminder for this match' : 'Enables a reminder 10 minutes before kickoff'
      }
      accessibilityState={{
        checked: value,
        disabled: disabled || pending,
        busy: pending,
      }}
      disabled={disabled || pending}
      hitSlop={8}
      onPress={() => {
        void handlePress();
      }}
      className="h-[30px] w-[52px] justify-center rounded-full border border-stroke px-[3px]"
      style={{ opacity: disabled || pending ? 0.6 : 1 }}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: colors.accent,
            borderRadius: 999,
            opacity: progress,
          },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          {
            width: 22,
            height: 22,
            transform: [{ translateX }],
          },
        ]}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: colors.textMuted,
          }}
        />
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              borderRadius: 11,
              backgroundColor: colors.bg,
              opacity: progress,
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

function MatchReminderToggle({ match }: { match: Match }) {
  const {
    preferences,
    preferencesLoaded,
    updatingMatchId,
    enabledMatchReminders,
    setMatchReminder,
  } = useNotifications();
  const [noticeKind, setNoticeKind] = useState<ReminderNoticeKind | null>(null);

  if (
    !preferencesLoaded ||
    !preferences.matchRemindersEnabled ||
    match.minute
  ) {
    return null;
  }

  const enabled = enabledMatchReminders.has(match.id);

  const handleChange = async (value: boolean): Promise<boolean> => {
    const result = await setMatchReminder(match, value);
    if (result === 'success') return true;

    setNoticeKind(result);
    return false;
  };

  return (
    <>
      <View className="self-stretch mt-5 flex-row items-center justify-between rounded-2xl border border-stroke bg-bgCard2 px-4 py-3">
        <View className="flex-1 pr-4">
          <Text className="font-inter font-semibold text-sm text-text">
            Match reminder
          </Text>
          <Text className="font-inter font-normal text-xs text-textSecondary mt-1">
            Notify me 10 minutes before kickoff
          </Text>
        </View>
        <MatchReminderSwitch
          value={enabled}
          disabled={updatingMatchId !== null}
          onChange={handleChange}
        />
      </View>
      {noticeKind ? (
        <MatchReminderNotice
          kind={noticeKind}
          onClose={() => setNoticeKind(null)}
        />
      ) : null}
    </>
  );
}

export default function MatchDetailScreen() {
  const { match: matchJson } = useLocalSearchParams<{ id: string; match?: string }>();
  const match: Match | null = useMemo<Match | null>(
    () => (matchJson ? JSON.parse(matchJson) : null),
    [matchJson]
  );
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(() => Boolean(match?.sources?.length));
  const [headerHeight, setHeaderHeight] = useState(340);

  const imageUri = posterUrl(match?.poster);

  useEffect(() => {
    if (!match?.sources?.length) return;
    Promise.all(
      match.sources.map((source) => fetchStreams(source.source, source.id))
    )
      .then((results) => setStreams(results.flat()))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [match]);

  const handleWatch = async (stream: Stream) => {
    router.push({ pathname: '/player', params: { url: stream.embedUrl, title: match?.title } });
  };

  const formatSourceName = (source: string) => {
    return `Server ${source.charAt(0).toUpperCase() + source.slice(1)}`;
  };

  return (
    <ScreenContainer>
      <View className="relative">
        {imageUri && (
          <>
            <Image
              source={{ uri: imageUri }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: headerHeight,
              }}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(10,10,12,0.35)', 'rgba(10,10,12,0.97)']}
              locations={[0.15, 1]}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                height: headerHeight,
              }}
            />
          </>
        )}
        <View className="pt-[60px] px-6 pb-5" onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
          <View className="flex-row items-center gap-4 mb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-bgCard2 justify-center items-center"
            >
              <ArrowLeft size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {match?.teams ? (
            <View className="items-center gap-4">
              <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-liveRed" />
                <Text className="font-inter font-semibold text-xs text-liveRed tracking-wide uppercase">
                  {match.category}
                </Text>
              </View>
              <View className="flex-row items-center gap-6">
                <View className="items-center gap-3">
                  {badgeUrl(match.teams.home?.badge) ? (
                    <Image source={{ uri: badgeUrl(match.teams.home?.badge) }} className="w-20 h-20 rounded-full" resizeMode="contain" />
                  ) : (
                    <View className="w-20 h-20 rounded-full bg-bgCard2 border border-stroke" />
                  )}
                  <Text className="font-inter font-bold text-base text-text w-28 text-center" numberOfLines={2}>
                    {match.teams.home?.name}
                  </Text>
                </View>
                <View className="items-center gap-2">
                  <View className="py-[4px] px-[10px] bg-liveRed rounded-full">
                    <Text className="font-inter font-bold text-[10px] text-text tracking-wide">
                      ● LIVE
                    </Text>
                  </View>
                  <Text className="font-inter font-extrabold text-[32px] text-text">
                    VS
                  </Text>
                </View>
                <View className="items-center gap-3">
                  {badgeUrl(match.teams.away?.badge) ? (
                    <Image source={{ uri: badgeUrl(match.teams.away?.badge) }} className="w-20 h-20 rounded-full" resizeMode="contain" />
                  ) : (
                    <View className="w-20 h-20 rounded-full bg-bgCard2 border border-stroke" />
                  )}
                  <Text className="font-inter font-bold text-base text-text w-28 text-center" numberOfLines={2}>
                    {match.teams.away?.name}
                  </Text>
                </View>
              </View>
              <Text className="font-inter font-medium text-sm text-textMuted">
                {match.title}
              </Text>
              <CountdownTimer target={match.date} />
            </View>
          ) : (
            <View className="items-center gap-4 px-4">
              <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-liveRed" />
                <Text className="font-inter font-semibold text-xs text-liveRed tracking-wide uppercase">
                  {match?.category}
                </Text>
              </View>
              <Text className="font-inter font-bold text-2xl text-text text-center" numberOfLines={3}>
                {match?.title}
              </Text>
              <CountdownTimer target={match?.date ?? 0} />
            </View>
          )}
          {match ? <MatchReminderToggle match={match} /> : null}
        </View>
      </View>
      <View className="flex-1 bg-bgCard rounded-t-[28px] pt-6 px-6">
        <View className="flex-row items-center justify-between mb-5">
          <Text className="font-inter font-bold text-[17px] text-text">
            Available Streams
          </Text>
          {streams.length > 0 && (
            <Text className="font-inter font-medium text-xs text-textSecondary">
              {streams.length} source{streams.length > 1 ? 's' : ''}
            </Text>
          )}
        </View>
        {loading ? (
          <View className="gap-[14px]">
            <StreamRowSkeleton />
            <StreamRowSkeleton />
            <StreamRowSkeleton />
          </View>
        ) : streams.length === 0 ? (
          <View className="items-center pt-16">
            <Text className="font-inter font-semibold text-[15px] text-text mb-2">No streams available</Text>
            <Text className="font-inter font-normal text-sm text-textSecondary text-center leading-5">
              Stream sources may appear closer{'\n'}to match start time
            </Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="gap-[14px] pb-20">
              {streams.map((stream, i) => (
                <Reveal key={`${stream.source}-${stream.streamNo}`} delay={i * 40}>
                  <StreamRow
                    serverName={formatSourceName(stream.source)}
                    quality={stream.hd ? 'HD' : 'SD'}
                    language={stream.language ?? 'EN'}
                    tag={stream.viewers ? `${stream.viewers} watching` : 'Available'}
                    onPress={() => handleWatch(stream)}
                  />
                </Reveal>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </ScreenContainer>
  );
}
