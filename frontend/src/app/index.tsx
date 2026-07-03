import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/theme';
import Button from '@/components/Button';

export default function OnboardingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          position: 'absolute',
          top: -260,
          left: -85,
          width: 560,
          height: 560,
          borderRadius: 280,
          backgroundColor: colors.accent,
          opacity: 0.16,
        }}
      />
      <View style={{ flex: 1 }}>
        <View style={{ width: 390, height: 480, backgroundColor: colors.bgCard }} />
      </View>
      <View style={{ position: 'absolute', top: 56, left: 24, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.accent }} />
        <Text style={{ fontFamily: 'Inter', fontWeight: '800', fontSize: 18, color: colors.text }}>
          Streamed
        </Text>
      </View>
      <View style={{ position: 'absolute', left: 24, top: 460, gap: 16, width: 342 }}>
        <View
          style={{
            paddingVertical: 6,
            paddingHorizontal: 12,
            alignSelf: 'flex-start',
            backgroundColor: colors.bgCard2,
            borderColor: colors.stroke,
            borderWidth: 1,
            borderRadius: 100,
          }}
        >
          <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 10, letterSpacing: 1.5, color: colors.accent }}>
            GLOBAL LIVE SPORTS
          </Text>
        </View>
        <Text style={{ fontFamily: 'Inter', fontWeight: '800', fontSize: 34, lineHeight: 38, color: colors.text }}>
          Every Match.{'\n'}One Tap Away.
        </Text>
        <Text style={{ fontFamily: 'Inter', fontWeight: '400', fontSize: 14, lineHeight: 21, color: colors.textMuted }}>
          Discover live and upcoming fixtures across football, basketball, tennis and more — then jump straight into the broadcast.
        </Text>
        <View style={{ height: 4 }} />
        <Button
          label="Get Started"
          onPress={() => router.replace('/(tabs)')}
          fullWidth
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 18, height: 6, borderRadius: 3, backgroundColor: colors.accent }} />
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.stroke }} />
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.stroke }} />
        </View>
      </View>
    </View>
  );
}
