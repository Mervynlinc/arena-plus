import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import MatchCardPoster from '@/components/MatchCardPoster';
import { fetchSports, fetchLiveMatches, Match, Sport } from '@/lib/api';
import ScreenContainer from '@/components/ScreenContainer';
import SectionSkeleton from '@/components/skeletons/SectionSkeleton';
import Reveal from '@/components/Reveal';

function dedupeMatches(matches: Match[]): Match[] {
  const seen = new Set<string>();
  return matches.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
}

export default function LiveScreen() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchSports(), fetchLiveMatches()])
      .then(([sportList, liveList]) => {
        setSports(sportList);
        setLiveMatches(dedupeMatches(liveList));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const sportNameMap: Record<string, string> = {};
  sports.forEach((s) => { sportNameMap[s.id] = s.name; });

  const matchesBySport: Record<string, Match[]> = {};
  liveMatches.forEach((m) => {
    const cat = m.category;
    if (!matchesBySport[cat]) matchesBySport[cat] = [];
    matchesBySport[cat].push(m);
  });

  return (
    <ScreenContainer>
      <View className="pt-[60px] px-6 pb-4">
        <View className="flex-row items-center gap-4 mb-6">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-bgCard2 justify-center items-center">
            <ArrowLeft size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text className="font-inter font-bold text-xl text-text">Live Now</Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="gap-0">
            <SectionSkeleton count={2} />
            <SectionSkeleton count={2} />
            <SectionSkeleton count={2} />
          </View>
        ) : liveMatches.length === 0 ? (
          <View className="px-6">
            <Text className="font-inter text-sm text-textSecondary">No live matches currently</Text>
          </View>
        ) : (
          <Reveal>
            {sports.filter((s) => (matchesBySport[s.id]?.length ?? 0) > 0).map((sport) => (
              <View key={sport.id} className="mb-6 pl-6">
                <Text className="font-inter font-bold text-[17px] text-text mb-[14px]">
                  {sportNameMap[sport.id] ?? sport.id}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-3 pr-6">
                    {matchesBySport[sport.id].map((match) => (
                      <MatchCardPoster
                        key={match.id}
                        match={match}
                        badge={
                          <View className="px-2 py-1 bg-liveRed rounded-full">
                            <Text className="font-inter font-bold text-[10px] tracking-[0.3px] text-white">LIVE</Text>
                          </View>
                        }
                      />
                    ))}
                  </View>
                </ScrollView>
              </View>
            ))}
          </Reveal>
        )}
        <View className="h-10" />
      </ScrollView>
    </ScreenContainer>
  );
}
