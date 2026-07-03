import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/theme';

interface TeamLogoProps {
  color: string;
}

function TeamLogo({ color }: TeamLogoProps) {
  return (
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: color,
      }}
    />
  );
}

interface Props {
  league: string;
  minute: string;
  homeTeam: string;
  homeColor: string;
  awayTeam: string;
  awayColor: string;
  homeScore: number;
  awayScore: number;
  onPress: () => void;
}

export default function MatchCardLive({
  league,
  minute,
  homeTeam,
  homeColor,
  awayTeam,
  awayColor,
  homeScore,
  awayScore,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        padding: 16,
        gap: 12,
        backgroundColor: colors.bgCard2,
        borderColor: colors.stroke,
        borderWidth: 1,
        borderRadius: 20,
        width: 358,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'Inter', fontWeight: '600', fontSize: 12, color: colors.textMuted }}>
          {league}
        </Text>
        <View style={{ flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 4, alignItems: 'center', gap: 5, backgroundColor: colors.text, borderRadius: 100 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.text }} />
          <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 10, letterSpacing: 0.3, color: colors.text }}>
            LIVE {minute}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <TeamLogo color={homeColor} />
          <Text style={{ fontFamily: 'Inter', fontWeight: '600', fontSize: 12, color: colors.text }}>
            {homeTeam}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text style={{ fontFamily: 'Inter', fontWeight: '800', fontSize: 28, color: colors.text }}>
            {homeScore}
          </Text>
          <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 20, color: colors.textSecondary }}>
            -
          </Text>
          <Text style={{ fontFamily: 'Inter', fontWeight: '800', fontSize: 28, color: colors.text }}>
            {awayScore}
          </Text>
        </View>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <TeamLogo color={awayColor} />
          <Text style={{ fontFamily: 'Inter', fontWeight: '600', fontSize: 12, color: colors.text }}>
            {awayTeam}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
