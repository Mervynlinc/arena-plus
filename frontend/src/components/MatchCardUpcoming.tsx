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
      className="p-[14px] px-4 flex-row justify-between items-center bg-bgCard2 border border-stroke rounded-[18px] w-[358px] h-[76px]"
    >
      <View className="p-2 px-3 items-center gap-[2px]">
        <Text className="font-inter font-bold text-sm text-accent">
          {time}
        </Text>
        <Text className="font-inter font-medium text-[10px] text-textSecondary">
          {date}
        </Text>
      </View>
      <View className="gap-[6px]">
        <View className="flex-row items-center gap-2">
          <View className="w-[18px] h-[18px] rounded-full" style={{ backgroundColor: homeColor }} />
          <Text className="font-inter font-semibold text-[13px] text-text">
            {homeTeam}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="w-[18px] h-[18px] rounded-full" style={{ backgroundColor: awayColor }} />
          <Text className="font-inter font-semibold text-[13px] text-text">
            {awayTeam}
          </Text>
        </View>
      </View>
      <View className="flex-row gap-1 items-center">
        <View className="w-5 h-5 rounded-full" style={{ backgroundColor: leagueColor }} />
        <Text className="font-inter font-medium text-[10px] text-textSecondary">
          {league}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
