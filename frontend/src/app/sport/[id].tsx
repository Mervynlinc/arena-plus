import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { fetchMatchesBySport, fetchPopularMatchesBySport, fetchLiveMatches, badgeUrl, Match } from '@/lib/api';
import MatchCardPoster, { formatDate } from '@/components/MatchCardPoster';
import ScreenContainer from '@/components/ScreenContainer';

function LiveBadge() {
  return (
    <View className="flex-row items-center gap-[5px] px-2 py-1 bg-liveRed rounded-full">
      <View className="w-[6px] h-[6px] rounded-full bg-white" />
      <Text className="font-inter font-bold text-[10px] tracking-[0.3px] text-white">
        LIVE
      </Text>
    </View>
  );
}

function MatchCard({ match }: { match: Match }) {
  const { date: dateLabel, time } = formatDate(match.date);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="p-[14px] px-4 flex-row justify-between items-center bg-bgCard2 border border-stroke rounded-[18px] w-[358px] h-[76px]"
      onPress={() => router.push({ pathname: '/match/[id]', params: { id: match.id, match: JSON.stringify(match) } })}
    >
      <View className="p-2 px-3 items-center gap-[2px]">
        <Text className="font-inter font-bold text-sm text-accent">{time}</Text>
        <Text className="font-inter font-medium text-[10px] text-textSecondary">{dateLabel}</Text>
      </View>
      {match.teams ? (
        <View className="gap-[6px]">
          <View className="flex-row items-center gap-2">
            {badgeUrl(match.teams.home?.badge) ? (
              <Image source={{ uri: badgeUrl(match.teams.home?.badge) }} className="w-[18px] h-[18px] rounded-full" resizeMode="contain" />
            ) : (
              <View className="w-[18px] h-[18px] rounded-full bg-bgCard" />
            )}
            <Text className="font-inter font-semibold text-[13px] text-text">{match.teams.home?.name}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            {badgeUrl(match.teams.away?.badge) ? (
              <Image source={{ uri: badgeUrl(match.teams.away?.badge) }} className="w-[18px] h-[18px] rounded-full" resizeMode="contain" />
            ) : (
              <View className="w-[18px] h-[18px] rounded-full bg-bgCard" />
            )}
            <Text className="font-inter font-semibold text-[13px] text-text">{match.teams.away?.name}</Text>
          </View>
        </View>
      ) : (
        <View className="flex-1 px-3">
          <Text className="font-inter font-semibold text-[13px] text-text" numberOfLines={2}>{match.title}</Text>
        </View>
      )}
      <View className="flex-row gap-1 items-center">
        <Text className="font-inter font-medium text-[10px] text-textSecondary">{match.category}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function SportMatchesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [popular, setPopular] = useState<Match[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [popularLoading, setPopularLoading] = useState(true);
  const [liveLoading, setLiveLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchMatchesBySport(id)
      .then(setMatches)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchPopularMatchesBySport(id)
      .then((ms) => setPopular(ms.filter((m) => m.poster)))
      .catch(() => {})
      .finally(() => setPopularLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchLiveMatches()
      .then((ms) => setLiveMatches(ms.filter((m) => m.category === id)))
      .catch(() => {})
      .finally(() => setLiveLoading(false));
  }, [id]);

  const title = id ? id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ') : '';

  return (
    <ScreenContainer>
      <View className="pt-[60px] px-6 pb-4">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-bgCard2 justify-center items-center">
            <ArrowLeft size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text className="font-inter font-bold text-xl text-text">{title}</Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {!liveLoading && (
          <View className="mb-6 pl-6">
            <View className="flex-row items-center gap-2 mb-3">
              <View className="w-2 h-2 rounded-full bg-liveRed" />
              <Text className="font-inter font-bold text-[17px] text-text">
                Live Now
              </Text>
            </View>
            {liveMatches.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3 pr-6">
                  {liveMatches.map((match) => (
                    <MatchCardPoster key={match.id} match={match} badge={<LiveBadge />} />
                  ))}
                </View>
              </ScrollView>
            ) : (
              <View className="pr-6">
                <Text className="font-inter font-normal text-sm text-textSecondary">
                  No live matches currently
                </Text>
              </View>
            )}
          </View>
        )}
        {!popularLoading && popular.length > 0 && (
          <View className="mb-6 pl-6">
            <Text className="font-inter font-bold text-[17px] text-text mb-3">
              Popular
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3 pr-6">
                {popular.map((match) => (
                  <MatchCardPoster key={match.id} match={match} />
                ))}
              </View>
            </ScrollView>
          </View>
        )}
        <View className="px-6">
          <Text className="font-inter font-bold text-[17px] text-text mb-3">
            All Matches
          </Text>
          {loading ? (
            <View className="items-center pt-10">
              <ActivityIndicator color={colors.accent} size="large" />
            </View>
          ) : error ? (
            <Text className="font-inter text-sm text-red-500">{error}</Text>
          ) : matches.length === 0 ? (
            <Text className="font-inter text-sm text-textSecondary">No matches found</Text>
          ) : (
            <View className="gap-3 pb-20">
              {matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
