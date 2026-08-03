import { View, Text, ScrollView } from 'react-native';
import ScreenContainer from '@/components/ScreenContainer';

interface SettingRowProps {
  label: string;
  value?: string;
  hasToggle?: boolean;
  toggleOn?: boolean;
}

function SettingRow({ label, value, hasToggle, toggleOn }: SettingRowProps) {
  return (
    <View className="px-4">
      <View className="flex-row justify-between items-center py-4">
        <View className="flex-row items-center gap-[14px]">
          <View
            className={`w-[6px] h-[6px] rounded-[3px] ${label === 'Video Quality' ? 'bg-accent' : 'bg-textSecondary'}`}
          />
          <Text className="font-inter font-medium text-sm text-text">
            {label}
          </Text>
        </View>
        {hasToggle ? (
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
    </View>
  );
}

export default function SettingsScreen() {
  return (
    <ScreenContainer>
      <View className="absolute top-0 left-0 right-0 h-14 bg-bgCard justify-center">
        <View className="flex-row items-center px-4">
          <Text className="font-inter font-normal text-[22px] text-text mr-[10px]">
            ←
          </Text>
          <Text className="font-inter font-bold text-xl text-text">
            Settings
          </Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="pt-14">
          <View className="flex-row p-3 px-4 items-center gap-[22px] bg-bgCard">
            <View className="w-12 h-12 rounded-full bg-accent justify-center items-center">
              <Text className="font-inter font-bold text-lg text-bg">
                JB
              </Text>
            </View>
            <View className="flex-1">
              <Text className="font-inter font-semibold text-base text-text">
                John Brown
              </Text>
              <Text className="font-inter font-normal text-xs text-textMuted">
                john@example.com
              </Text>
            </View>
            <Text className="font-inter font-normal text-[22px] text-textSecondary">
              ›
            </Text>
          </View>
          <View className="px-4 pt-8">
            <Text className="font-inter font-bold text-[11px] text-textSecondary mb-4">
              STREAMING
            </Text>
            <View className="bg-bgCard rounded-[20px] overflow-hidden w-[358px]">
              <SettingRow label="Video Quality" value="Auto" />
              <SettingRow label="Data Saver" hasToggle toggleOn={false} />
              <SettingRow label="Streaming Region" value="Auto" />
            </View>
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
    </ScreenContainer>
  );
}
