import { View, Text, TouchableOpacity } from 'react-native';

interface TeamLogoProps {
  color: string;
}

function TeamLogo({ color }: TeamLogoProps) {
  return (
    <View className="w-9 h-9 rounded-full" style={{ backgroundColor: color }} />
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
      className="p-4 gap-3 bg-bgCard2 border border-stroke rounded-[20px] w-[358px]"
    >
      <View className="flex-row justify-between items-center">
        <Text className="font-inter font-semibold text-xs text-textMuted">
          {league}
        </Text>
        <View className="flex-row px-2 py-1 items-center gap-[5px] bg-text rounded-full">
          <View className="w-[6px] h-[6px] rounded-[3px] bg-text" />
          <Text className="font-inter font-bold text-[10px] tracking-[0.3px] text-text">
            LIVE {minute}
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center">
        <View className="items-center gap-2">
          <TeamLogo color={homeColor} />
          <Text className="font-inter font-semibold text-xs text-text">
            {homeTeam}
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Text className="font-inter font-extrabold text-[28px] text-text">
            {homeScore}
          </Text>
          <Text className="font-inter font-bold text-xl text-textSecondary">
            -
          </Text>
          <Text className="font-inter font-extrabold text-[28px] text-text">
            {awayScore}
          </Text>
        </View>
        <View className="items-center gap-2">
          <TeamLogo color={awayColor} />
          <Text className="font-inter font-semibold text-xs text-text">
            {awayTeam}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
