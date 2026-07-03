import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/theme';

interface Props {
  time: string;
  date: string;
  homeTeam: string;
  homeColor: string;
  awayTeam: string;
  awayColor: string;
  league: string;
  leagueColor?: string;
  onPress: () => void;
}

export default function MatchCardUpcoming({
  time,
  date,
  homeTeam,
  homeColor,
  awayTeam,
  awayColor,
  league,
  leagueColor = colors.accent,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        padding: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.bgCard2,
        borderColor: colors.stroke,
        borderWidth: 1,
        borderRadius: 18,
        width: 358,
        height: 76,
      }}
    >
      <View style={{ padding: 8, paddingHorizontal: 12, alignItems: 'center', gap: 2 }}>
        <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 14, color: colors.accent }}>
          {time}
        </Text>
        <Text style={{ fontFamily: 'Inter', fontWeight: '500', fontSize: 10, color: colors.textSecondary }}>
          {date}
        </Text>
      </View>
      <View style={{ gap: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: homeColor }} />
          <Text style={{ fontFamily: 'Inter', fontWeight: '600', fontSize: 13, color: colors.text }}>
            {homeTeam}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: awayColor }} />
          <Text style={{ fontFamily: 'Inter', fontWeight: '600', fontSize: 13, color: colors.text }}>
            {awayTeam}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: leagueColor }} />
        <Text style={{ fontFamily: 'Inter', fontWeight: '500', fontSize: 10, color: colors.textSecondary }}>
          {league}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
