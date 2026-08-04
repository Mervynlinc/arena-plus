import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useUser } from '@clerk/expo';
import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import SportCategoryTile from '@/components/SportCategoryTile';
import MatchCardPoster from '@/components/MatchCardPoster';
import { fetchSports, fetchLiveMatches, fetchPopularMatchesBySport, Match, Sport } from '@/lib/api';
import ScreenContainer from '@/components/ScreenContainer';
import { sportEmoji } from '@/lib/sports';
import SportTileSkeleton from '@/components/skeletons/SportTileSkeleton';
import MatchCardSkeleton from '@/components/skeletons/MatchCardSkeleton';
import Reveal from '@/components/Reveal';

export default function HomeScreen() {
  const { user } = useUser();
  const [sports, setSports] = useState<Sport[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [popularMatches, setPopularMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveLoading, setLiveLoading] = useState(true);
  const [popularLoading, setPopularLoading] = useState(true);
  const [sportNameMap, setSportNameMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSports()
      .then((data) => {
        setSports(data);
        const map: Record<string, string> = {};
        data.forEach((s) => { map[s.id] = s.name; });
        setSportNameMap(map);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchLiveMatches()
      .then(setLiveMatches)
      .catch(console.error)
      .finally(() => setLiveLoading(false));
  }, []);

  useEffect(() => {
    if (sports.length === 0) return;
    Promise.all(
      sports.map((s) =>
        fetchPopularMatchesBySport(s.id).catch(() => [] as Match[])
      )
    )
      .then((results) => {
        const seen = new Set<string>();
        const all = results.flat().filter((m) => {
          if (seen.has(m.id)) return false;
          seen.add(m.id);
          return true;
        });
        setPopularMatches(all);
      })
      .catch(console.error)
      .finally(() => setPopularLoading(false));
  }, [sports]);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const name = user?.username ?? user?.firstName ?? 'there';

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="pt-[60px] pb-8">
          <View className="px-6 flex-row justify-between items-center mb-7">
            <View className="gap-[2px]">
              <Text className="font-inter font-medium text-xs text-textSecondary">
                {greeting}
              </Text>
              <Text className="font-inter font-bold text-xl text-text">
                {name}
              </Text>
            </View>
          </View>
          <TouchableOpacity className="px-6 mb-7" onPress={() => router.push('/search')} activeOpacity={0.8}>
            <View className="flex-row items-center gap-[10px] py-[14px] px-4 bg-bgCard2 border border-stroke rounded-2xl h-14">
              <Search size={18} color={colors.textSecondary} />
              <Text className="font-inter font-normal text-[13px] text-textSecondary">
                Search teams, leagues...
              </Text>
            </View>
          </TouchableOpacity>
          <View className="mb-7 pl-6">
            <Text className="font-inter font-bold text-[17px] text-text mb-[14px]">
              Sports
            </Text>
            {loading ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3 pr-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SportTileSkeleton key={i} />
                  ))}
                </View>
              </ScrollView>
            ) : (
              <Reveal>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-3">
                    {sports.map((sport) => (
                      <SportCategoryTile
                        key={sport.id}
                        label={sport.name}
                        emoji={sportEmoji(sport.id)}
                        onPress={() => router.push(`/sport/${sport.id}` as any)}
                      />
                    ))}
                  </View>
                </ScrollView>
              </Reveal>
            )}
          </View>
          <View className="pl-6 gap-[14px] mb-7">
            <View className="flex-row justify-between items-center pr-6">
              <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-red" />
                <Text className="font-inter font-bold text-[17px] text-text">
                  Live Now
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/live' as any)} activeOpacity={0.7}>
                <Text className="font-inter font-semibold text-[13px] text-accent">
                  See all
                </Text>
              </TouchableOpacity>
            </View>
            {liveLoading ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3 pr-6">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <MatchCardSkeleton key={i} />
                  ))}
                </View>
              </ScrollView>
            ) : liveMatches.length === 0 ? (
              <Text className="font-inter text-sm text-textSecondary pr-6">
                No live matches currently
              </Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3 pr-6">
                  {liveMatches.map((match, i) => (
                    <Reveal key={match.id} delay={i * 40}>
                      <MatchCardPoster
                        match={match}
                        badge={
                          <View className="px-2 py-1 bg-bgCard border border-stroke rounded-full">
                            <Text className="font-inter font-bold text-[10px] tracking-[0.3px] text-textSecondary">
                              {sportNameMap[match.category] ?? match.category}
                            </Text>
                          </View>
                        }
                      />
                    </Reveal>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
          <View className="pl-6 gap-[14px] mb-7">
            <Text className="font-inter font-bold text-[17px] text-text mb-[14px]">
              Popular
            </Text>
            {popularLoading ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3 pr-6">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <MatchCardSkeleton key={i} />
                  ))}
                </View>
              </ScrollView>
            ) : popularMatches.length === 0 ? (
              <Text className="font-inter text-sm text-textSecondary pr-6">
                No popular matches
              </Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3 pr-6">
                  {popularMatches.map((match, i) => (
                    <Reveal key={match.id} delay={i * 40}>
                      <MatchCardPoster match={match} />
                    </Reveal>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>

        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
