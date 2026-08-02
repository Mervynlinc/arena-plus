import { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/theme';
import CategoryPill from '@/components/CategoryPill';
import MatchCardPoster from '@/components/MatchCardPoster';
import { fetchSports, fetchMatchesBySport, Match, Sport } from '@/lib/api';
import ScreenContainer from '@/components/ScreenContainer';

const FILTERS = ['Today', 'Live', 'Popular'] as const;
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

function dedupeMatches(matches: Match[]): Match[] {
  const seen = new Set<string>();
  return matches.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
}

export default function MatchesScreen() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [matchesBySport, setMatchesBySport] = useState<Record<string, Match[]>>({});
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
    fetchSports()
      .then((sportList) => {
        setSports(sportList);
        return Promise.all(
          sportList.map((s) =>
            fetchMatchesBySport(s.id)
              .then((ms) => ({ sportId: s.id, matches: ms }))
              .catch(() => ({ sportId: s.id, matches: [] as Match[] }))
          )
        );
      })
      .then((results) => {
        const map: Record<string, Match[]> = {};
        results.forEach((r) => { map[r.sportId] = dedupeMatches(r.matches); });
        setMatchesBySport(map);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredMatches = (sportId: string): Match[] => {
    const matches = matchesBySport[sportId] ?? [];
    if (activeFilters.size === 0) return matches;
    return matches.filter((m) => {
      if (activeFilters.has('Today') && !isToday(m.date)) return false;
      if (activeFilters.has('Live') && !m.minute) return false;
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
            Matches
          </Text>
          <View className="flex-row gap-[10px] mb-6 px-6">
            <CategoryPill label="All" active={activeFilters.size === 0} onPress={() => setActiveFilters(new Set())} />
            {FILTERS.map((f) => (
              <CategoryPill key={f} label={f} active={activeFilters.has(f)} onPress={() => toggleFilter(f)} />
            ))}
          </View>
          {loading ? (
            <View className="items-center pt-10">
              <ActivityIndicator color={colors.accent} size="large" />
            </View>
          ) : (
            sports.filter((s) => hasMatches(s.id)).map((sport) => (
              <View key={sport.id} className="mb-6 pl-6">
                <Text className="font-inter font-bold text-[17px] text-text mb-[14px]">
                  {sport.name}
                </Text>
                {filteredMatches(sport.id).length > 0 ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row gap-3 pr-6">
                      {filteredMatches(sport.id).map((match) => (
                        <MatchCardPoster key={match.id} match={match} />
                      ))}
                    </View>
                  </ScrollView>
                ) : (
                  <Text className="font-inter text-sm text-textSecondary">
                    No matches available
                  </Text>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
