import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { router } from 'expo-router';
import { Search, X, ArrowLeft } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { fetchAllMatches, badgeUrl, AllMatchesResult, Match } from '@/lib/api';
import { formatDate } from '@/components/MatchCardPoster';
import ScreenContainer from '@/components/ScreenContainer';

const DEBOUNCE_MS = 300;

function matchesQuery(match: Match, sportName: string, query: string): boolean {
  const q = query.toLowerCase();
  if (match.title.toLowerCase().includes(q)) return true;
  if (match.teams?.home?.name?.toLowerCase().includes(q)) return true;
  if (match.teams?.away?.name?.toLowerCase().includes(q)) return true;
  if (match.league?.toLowerCase().includes(q)) return true;
  if (sportName.toLowerCase().includes(q)) return true;
  return false;
}

export default function SearchScreen() {
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [allData, setAllData] = useState<AllMatchesResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllMatches()
      .then(setAllData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.trim().toLowerCase();
    const out: { sportName: string; match: Match }[] = [];
    for (const group of allData) {
      for (const match of group.matches) {
        if (matchesQuery(match, group.sportName, q)) {
          out.push({ sportName: group.sportName, match });
        }
      }
    }
    out.sort((a, b) => b.match.date - a.match.date);
    return out;
  }, [debouncedQuery, allData]);

  const clearInput = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    inputRef.current?.focus();
  }, []);

  return (
    <ScreenContainer>
      <View className="pt-[60px] px-6 pb-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-bgCard2 justify-center items-center">
            <ArrowLeft size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <View className="flex-1 flex-row items-center gap-2 px-4 bg-bgCard2 border border-stroke rounded-2xl h-14">
            <Search size={18} color={colors.textSecondary} />
            <TextInput
              ref={inputRef}
              value={query}
              onChangeText={setQuery}
              placeholder="Search teams, leagues..."
              placeholderTextColor={colors.textSecondary}
              className="flex-1 h-full py-0 font-inter font-normal text-[13px] text-text"
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={clearInput} className="p-1">
                <X size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="px-6 pb-20">
          {loading ? (
            <View className="items-center pt-20">
              <ActivityIndicator size="large" color={colors.accent} />
            </View>
          ) : debouncedQuery.trim().length > 0 && results.length === 0 ? (
            <View className="items-center pt-20">
              <Text className="font-inter font-semibold text-[15px] text-text mb-2">No results found</Text>
              <Text className="font-inter font-normal text-sm text-textSecondary text-center leading-5">
                Try searching for a team,{'\n'}league, or sport
              </Text>
            </View>
          ) : debouncedQuery.trim().length === 0 ? (
            <View className="items-center pt-20">
              <Search size={48} color={colors.textSecondary} />
              <Text className="font-inter font-semibold text-[15px] text-text mt-4 mb-2">Search matches</Text>
              <Text className="font-inter font-normal text-sm text-textSecondary text-center leading-5">
                Find matches by team, league,{'\n'}or sport name
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              <Text className="font-inter font-semibold text-[13px] text-textSecondary mb-1">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </Text>
              {results.map(({ match, sportName }) => {
                const { time, date: dateLabel } = formatDate(match.date);
                return (
                  <TouchableOpacity
                    key={match.id}
                    activeOpacity={0.8}
                    className="p-[14px] px-4 flex-row justify-between items-center bg-bgCard2 border border-stroke rounded-[18px]"
                    onPress={() => router.push({ pathname: '/match/[id]', params: { id: match.id, match: JSON.stringify(match) } })}
                  >
                    <View className="p-2 px-3 items-center gap-[2px]">
                      <Text className="font-inter font-bold text-sm text-accent">{time}</Text>
                      <Text className="font-inter font-medium text-[10px] text-textSecondary">{dateLabel}</Text>
                    </View>
                    {match.teams ? (
                      <View className="flex-1 gap-[6px] px-3">
                        <View className="flex-row items-center gap-2">
                          {badgeUrl(match.teams.home?.badge) ? (
                            <Image source={{ uri: badgeUrl(match.teams.home?.badge) }} className="w-[18px] h-[18px] rounded-full" resizeMode="contain" />
                          ) : (
                            <View className="w-[18px] h-[18px] rounded-full bg-bgCard" />
                          )}
                          <Text className="font-inter font-semibold text-[13px] text-text" numberOfLines={1}>{match.teams.home?.name}</Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                          {badgeUrl(match.teams.away?.badge) ? (
                            <Image source={{ uri: badgeUrl(match.teams.away?.badge) }} className="w-[18px] h-[18px] rounded-full" resizeMode="contain" />
                          ) : (
                            <View className="w-[18px] h-[18px] rounded-full bg-bgCard" />
                          )}
                          <Text className="font-inter font-semibold text-[13px] text-text" numberOfLines={1}>{match.teams.away?.name}</Text>
                        </View>
                      </View>
                    ) : (
                      <View className="flex-1 px-3">
                        <Text className="font-inter font-semibold text-[13px] text-text" numberOfLines={2}>{match.title}</Text>
                      </View>
                    )}
                    <View className="items-end gap-1">
                      <Text className="font-inter font-medium text-[10px] text-textSecondary">{sportName}</Text>
                      {match.minute && (
                        <View className="px-[6px] py-[2px] bg-liveRed rounded-full">
                          <Text className="font-inter font-bold text-[9px] text-white">LIVE</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
