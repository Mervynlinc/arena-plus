import { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import CategoryPill from '@/components/CategoryPill';
import MatchCardPoster from '@/components/MatchCardPoster';
import { fetchSports, fetchLiveMatches, Match, Sport } from '@/lib/api';
import ScreenContainer from '@/components/ScreenContainer';
import SectionSkeleton from '@/components/skeletons/SectionSkeleton';
import Reveal from '@/components/Reveal';

const FILTERS = ['Today', 'Popular'] as const;
type Filter = typeof FILTERS[number];

function isToday(timestamp: number): boolean {
  const d = new Date(timestamp);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

export default function WatchScreen() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Set<Filter>>(new Set());

  const toggleFilter = (f: Filter) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(f)) {
        next.delete(f);
      } else {
        next.add(f);
      }
      return next;
    });
  };

  useEffect(() => {
    Promise.all([fetchSports(), fetchLiveMatches()])
      .then(([sportList, liveList]) => {
        setSports(sportList);
        setLiveMatches(liveList);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const matchesBySport: Record<string, Match[]> = {};
  liveMatches.forEach((m) => {
    const cat = m.category;
    if (!matchesBySport[cat]) matchesBySport[cat] = [];
    matchesBySport[cat].push(m);
  });

  const filteredMatches = (sportId: string): Match[] => {
    const matches = matchesBySport[sportId] ?? [];
    if (activeFilters.size === 0) return matches;
    return matches.filter((m) => {
      if (activeFilters.has('Today') && !isToday(m.date)) return false;
      if (activeFilters.has('Popular') && !m.popular) return false;
      return true;
    });
  };

  const hasMatches = (sportId: string) => filteredMatches(sportId).length > 0;

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="pt-[60px] pb-[100px]">
          <Text className="font-inter font-bold text-2xl text-text mb-6 px-6">
            Watch
          </Text>
          <View className="flex-row gap-[10px] mb-6 px-6">
            <CategoryPill label="All" active={activeFilters.size === 0} onPress={() => setActiveFilters(new Set())} />
            {FILTERS.map((f) => (
              <CategoryPill key={f} label={f} active={activeFilters.has(f)} onPress={() => toggleFilter(f)} />
            ))}
          </View>
          {loading ? (
            <View className="gap-0">
              <SectionSkeleton count={2} />
              <SectionSkeleton count={2} />
              <SectionSkeleton count={2} />
            </View>
          ) : (
            <Reveal>
              {sports.filter((s) => hasMatches(s.id)).map((sport) => (
                <View key={sport.id} className="mb-6 pl-6">
                  <Text className="font-inter font-bold text-[17px] text-text mb-[14px]">
                    {sport.name}
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row gap-3 pr-6">
                      {filteredMatches(sport.id).map((match) => (
                        <MatchCardPoster key={match.id} match={match} />
                      ))}
                    </View>
                  </ScrollView>
                </View>
              ))}
            </Reveal>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
