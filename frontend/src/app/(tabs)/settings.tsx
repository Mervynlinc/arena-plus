import { View, Text, ScrollView } from 'react-native';
import { colors } from '@/constants/theme';

interface SettingRowProps {
  label: string;
  value?: string;
  hasToggle?: boolean;
  toggleOn?: boolean;
}

function SettingRow({ label, value, hasToggle, toggleOn }: SettingRowProps) {
  return (
    <View style={{ paddingLeft: 16, paddingRight: 16 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 16,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: label === 'Video Quality' ? colors.accent : colors.textSecondary,
            }}
          />
          <Text style={{ fontFamily: 'Inter', fontWeight: '500', fontSize: 14, color: colors.text }}>
            {label}
          </Text>
        </View>
        {hasToggle ? (
          <View
            style={{
              width: 32,
              height: 18,
              borderRadius: 9,
              backgroundColor: toggleOn ? colors.accent : colors.stroke,
              justifyContent: 'center',
              paddingHorizontal: 2,
              alignItems: toggleOn ? 'flex-end' : 'flex-start',
            }}
          >
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: toggleOn ? colors.bgCard : colors.textSecondary,
              }}
            />
          </View>
        ) : (
          <Text style={{ fontFamily: 'Inter', fontWeight: '400', fontSize: 13, color: colors.textMuted }}>
            {value} ›
          </Text>
        )}
      </View>
      <View style={{ height: 1, backgroundColor: colors.stroke, marginLeft: 20 }} />
    </View>
  );
}

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 56, backgroundColor: colors.bgCard, justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }}>
          <Text style={{ fontFamily: 'Inter', fontWeight: '400', fontSize: 22, color: colors.text, marginRight: 10 }}>
            ←
          </Text>
          <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 20, color: colors.text }}>
            Settings
          </Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingTop: 56 }} showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            padding: 12,
            paddingHorizontal: 16,
            alignItems: 'center',
            gap: 22,
            backgroundColor: colors.bgCard,
          }}
        >
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 18, color: colors.bg }}>
              JB
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'Inter', fontWeight: '600', fontSize: 16, color: colors.text }}>
              John Brown
            </Text>
            <Text style={{ fontFamily: 'Inter', fontWeight: '400', fontSize: 12, color: colors.textMuted }}>
              john@example.com
            </Text>
          </View>
          <Text style={{ fontFamily: 'Inter', fontWeight: '400', fontSize: 22, color: colors.textSecondary }}>
            ›
          </Text>
        </View>
        <View style={{ paddingHorizontal: 16, paddingTop: 32 }}>
          <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 11, color: colors.textSecondary, marginBottom: 16 }}>
            STREAMING
          </Text>
          <View
            style={{
              backgroundColor: colors.bgCard,
              borderRadius: 20,
              overflow: 'hidden',
              width: 358,
            }}
          >
            <SettingRow label="Video Quality" value="Auto" />
            <SettingRow label="Data Saver" hasToggle toggleOn={false} />
            <SettingRow label="Streaming Region" value="Auto" />
          </View>
        </View>
        <View style={{ paddingHorizontal: 16, paddingTop: 32 }}>
          <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 11, color: colors.textSecondary, marginBottom: 16 }}>
            NOTIFICATIONS
          </Text>
          <View
            style={{
              backgroundColor: colors.bgCard,
              borderRadius: 20,
              overflow: 'hidden',
              width: 358,
            }}
          >
            <SettingRow label="Match Reminders" hasToggle toggleOn />
            <SettingRow label="Score Alerts" hasToggle toggleOn />
            <SettingRow label="News & Updates" hasToggle toggleOn={false} />
          </View>
        </View>
        <View style={{ paddingHorizontal: 16, paddingTop: 32 }}>
          <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 11, color: colors.textSecondary, marginBottom: 16 }}>
            ABOUT
          </Text>
          <View
            style={{
              backgroundColor: colors.bgCard,
              borderRadius: 20,
              overflow: 'hidden',
              width: 358,
            }}
          >
            <SettingRow label="Version" value="1.0.0" />
            <SettingRow label="Terms of Service" value="" />
            <SettingRow label="Privacy Policy" value="" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
