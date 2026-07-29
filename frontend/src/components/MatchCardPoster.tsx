import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { posterUrl, Match } from '@/lib/api';

export const CARD_WIDTH = 160;
export const CARD_HEIGHT = 224;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(timestamp: number): { date: string; time: string } {
  const d = new Date(timestamp);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const mins = d.getMinutes().toString().padStart(2, '0');
  return {
    date: isToday ? 'Today' : `${d.getDate()} ${MONTHS[d.getMonth()]}`,
    time: `${hours}:${mins}`,
  };
}

interface Props {
  match: Match;
  badge?: React.ReactNode;
}

export default function MatchCardPoster({ match, badge }: Props) {
  const uri = posterUrl(match.poster);
  const { time, date: dateLabel } = formatDate(match.date);
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push({ pathname: '/match/[id]', params: { id: match.id, match: JSON.stringify(match) } })}
      className="rounded-[18px] overflow-hidden"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      {uri ? (
        <Image
          source={{ uri }}
          className="absolute inset-0"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
          resizeMode="cover"
        />
      ) : (
        <View className="flex-1 bg-bgCard2 justify-center items-center">
          <Text className="font-inter font-semibold text-xs text-textMuted">No poster</Text>
        </View>
      )}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        locations={[0.25, 1]}
        className="absolute inset-0"
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      />
      {badge && (
        <View className="absolute top-3 left-3">{badge}</View>
      )}
      <View className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-8">
        <Text className="font-inter font-bold text-sm text-text leading-[18px]" numberOfLines={2}>
          {match.title}
        </Text>
        <View className="flex-row items-center justify-between mt-1">
          <Text className="font-inter font-medium text-xs text-textMuted">
            {time}
          </Text>
          <Text className="font-inter font-medium text-xs text-textMuted">
            {dateLabel}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
