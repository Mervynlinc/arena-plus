import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { posterUrl, badgeUrl, Match } from '@/lib/api';
import { sportEmoji } from '@/lib/sports';

export const CARD_WIDTH = 200;
export const CARD_HEIGHT = 130;

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
  const hasTeams = Boolean(
    match.teams?.home?.name ||
      match.teams?.home?.badge ||
      match.teams?.away?.name ||
      match.teams?.away?.badge
  );
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
          contentFit="cover"
          transition={250}
        />
      ) : hasTeams ? (
        <View className="absolute inset-0 bg-bgCard2 items-center pt-5">
          <View className="flex-row items-center gap-4">
            {badgeUrl(match.teams.home?.badge) ? (
              <Image source={{ uri: badgeUrl(match.teams.home?.badge) }} className="w-14 h-14 rounded-full" contentFit="contain" transition={250} />
            ) : (
              <View className="w-14 h-14 rounded-full bg-bgCard border border-stroke" />
            )}
            <Text className="font-inter font-extrabold text-xl text-textMuted">VS</Text>
            {badgeUrl(match.teams.away?.badge) ? (
              <Image source={{ uri: badgeUrl(match.teams.away?.badge) }} className="w-14 h-14 rounded-full" contentFit="contain" transition={250} />
            ) : (
              <View className="w-14 h-14 rounded-full bg-bgCard border border-stroke" />
            )}
          </View>
        </View>
      ) : (
        <View className="absolute inset-0 bg-bgCard2 items-center justify-center">
          <Text className="text-5xl">{sportEmoji(match.category)}</Text>
        </View>
      )}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        locations={[0.4, 1]}
        className="absolute inset-0"
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      />
      {badge && (
        <View className="absolute top-3 left-3">{badge}</View>
      )}
      <View className="absolute bottom-0 left-0 right-0 px-3 pb-2 pt-6">
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
