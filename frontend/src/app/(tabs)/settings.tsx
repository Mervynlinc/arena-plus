import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth, useUser } from '@clerk/expo';
import { router } from 'expo-router';
import ConfirmDialog from '@/components/ConfirmDialog';
import EditNameDialog from '@/components/EditNameDialog';
import ScreenContainer from '@/components/ScreenContainer';

interface SettingRowProps {
  label: string;
  value?: string;
  hasToggle?: boolean;
  toggleOn?: boolean;
  destructive?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
}

function SettingRow({
  label,
  value,
  hasToggle,
  toggleOn,
  destructive,
  onPress,
  children,
}: SettingRowProps) {
  const content = (
    <>
      <View className="flex-row justify-between items-center py-4">
        <View className="flex-row items-center gap-[14px]">
          <View
            className={`w-[6px] h-[6px] rounded-[3px] ${destructive ? 'bg-liveRed' : 'bg-textSecondary'}`}
          />
          <Text
            className={`font-inter font-medium text-sm ${destructive ? 'text-liveRed' : 'text-text'}`}
          >
            {label}
          </Text>
        </View>
        {children ? (
          <View className="flex-1 items-end">{children}</View>
        ) : hasToggle ? (
          <View
            className={`w-8 h-[18px] rounded-[9px] justify-center px-[2px] ${toggleOn ? 'bg-accent' : 'bg-stroke'}`}
            style={{ alignItems: toggleOn ? 'flex-end' : 'flex-start' }}
          >
            <View
              className={`w-[14px] h-[14px] rounded-full ${toggleOn ? 'bg-bgCard' : 'bg-textSecondary'}`}
            />
          </View>
        ) : (
          <Text className="font-inter font-normal text-[13px] text-textMuted">
            {value} ›
          </Text>
        )}
      </View>
      <View className="h-[1px] bg-stroke ml-5" />
    </>
  );

  return (
    <View className="px-4">
      {onPress ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          {content}
        </TouchableOpacity>
      ) : (
        content
      )}
    </View>
  );
}

export default function SettingsScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [name, setName] = useState(user?.username ?? '');
  const [nameDialogVisible, setNameDialogVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<'logout' | 'delete' | null>(null);
  const [busy, setBusy] = useState(false);

  const username = user?.username ?? 'User';
  const email = user?.primaryEmailAddress?.emailAddress ?? '';
  const initials = username.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase() || 'U';

  const startEditName = () => {
    setName(user?.username ?? '');
    setNameDialogVisible(true);
    setError(null);
  };

  const onSaveName = async () => {
    if (!user || saving) return;
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Name cannot be empty.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const updated = await user.update({ username: trimmed });
      setName(updated.username ?? trimmed);
      setNameDialogVisible(false);
    } catch (e) {
      setError((e as { message?: string }).message ?? 'Could not save name.');
    } finally {
      setSaving(false);
    }
  };

  const onLogout = async () => {
    if (busy) return;
    setBusy(true);
    await signOut();
    router.replace('/(auth)/signin');
  };

  const onDeleteAccount = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await user?.delete();
      await signOut();
      router.replace('/(auth)/signin');
    } catch (e) {
      setBusy(false);
      setConfirm(null);
      setError((e as { message?: string }).message ?? 'Could not delete account.');
    }
  };

  const isDelete = confirm === 'delete';

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="pt-4">
          <View className="flex-row p-3 px-4 items-center gap-[22px] ">
            <View className="w-12 h-12 rounded-full bg-accent justify-center items-center">
              <Text className="font-inter font-bold text-lg text-bg">
                {initials}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="font-inter font-semibold text-base text-text">
                {username}
              </Text>
              <Text className="font-inter font-normal text-xs text-textMuted">
                {email}
              </Text>
            </View>
            <Text className="font-inter font-normal text-[22px] text-textSecondary">
              ›
            </Text>
          </View>
          <View className="px-4 pt-8">
            <Text className="font-inter font-bold text-[11px] text-textSecondary mb-4">
              PROFILE
            </Text>
            <View className="bg-bgCard rounded-[20px] overflow-hidden w-[358px]">
              <SettingRow label="Username" value={username} onPress={startEditName} />
              <SettingRow label="Email" value={email} />
              <SettingRow label="Log Out" onPress={() => setConfirm('logout')} />
              <SettingRow label="Delete Account" destructive onPress={() => setConfirm('delete')} />
            </View>
            {error ? (
              <Text className="font-inter font-normal text-[13px] leading-[18px] text-liveRed mt-3">
                {error}
              </Text>
            ) : null}
          </View>
          <View className="px-4 pt-8">
            <Text className="font-inter font-bold text-[11px] text-textSecondary mb-4">
              NOTIFICATIONS
            </Text>
            <View className="bg-bgCard rounded-[20px] overflow-hidden w-[358px]">
              <SettingRow label="Match Reminders" hasToggle toggleOn />
              <SettingRow label="Score Alerts" hasToggle toggleOn />
              <SettingRow label="News & Updates" hasToggle toggleOn={false} />
            </View>
          </View>
          <View className="px-4 pt-8">
            <Text className="font-inter font-bold text-[11px] text-textSecondary mb-4">
              ABOUT
            </Text>
            <View className="bg-bgCard rounded-[20px] overflow-hidden w-[358px]">
              <SettingRow label="Version" value="2.0.0" />
              <SettingRow label="Terms of Service" value="" />
              <SettingRow label="Privacy Policy" value="" />
            </View>
          </View>
        </View>
      </ScrollView>
      <EditNameDialog
        visible={nameDialogVisible}
        value={name}
        saving={saving}
        error={nameDialogVisible ? error : null}
        onChange={setName}
        onSave={onSaveName}
        onCancel={() => {
          if (!saving) setNameDialogVisible(false);
        }}
      />
      <ConfirmDialog
        visible={confirm !== null}
        title={isDelete ? 'Delete Account' : 'Log Out'}
        message={
          isDelete
            ? 'This will permanently delete your account and all associated data. This cannot be undone.'
            : 'Are you sure you want to log out of your account?'
        }
        confirmLabel={isDelete ? 'Delete' : 'Log Out'}
        destructive={isDelete}
        busy={busy}
        onConfirm={isDelete ? onDeleteAccount : onLogout}
        onCancel={() => {
          if (!busy) setConfirm(null);
        }}
      />
    </ScreenContainer>
  );
}
