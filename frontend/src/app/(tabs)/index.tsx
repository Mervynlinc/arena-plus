import { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import SportCategoryTile from '@/components/SportCategoryTile';
import MatchCardLive from '@/components/MatchCardLive';
import MatchCardUpcoming from '@/components/MatchCardUpcoming';
import { fetchSports, Sport } from '@/lib/api';

const SPORT_COLORS: Record<string, string> = {
  football: colors.accent,
  basketball: '#E8772E',
  tennis: '#4CAF50',
  cricket: '#2196F3',
  'motor-sports': '#9C27B0',
  'american-football': '#8B4513',
  hockey: '#006F6F',
  baseball: '#C41E3A',
  fight: '#E5344E',
  rugby: '#005A34',
  golf: '#FFD700',
  billiards: '#2E8B57',
  afl: '#8B0000',
  darts: '#DAA520',
  other: '#6B7280',
};

export default function HomeScreen() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSports()
      .then(setSports)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <View className="flex-1 bg-bg">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="pt-[60px] pb-8">
          <View className="px-6 flex-row justify-between items-center mb-7">
            <View className="gap-[2px]">
              <Text className="font-inter font-medium text-xs text-textSecondary">
                Good evening
              </Text>
              <Text className="font-inter font-bold text-xl text-text">
                Welcome back, Brown
              </Text>
            </View>
            <View className="w-11 h-11 rounded-full bg-bgCard2 border border-accent border-[1.5px]" />
          </View>
          <View className="px-6 mb-7">
            <View className="flex-row items-center gap-[10px] py-[14px] px-4 bg-bgCard2 border border-stroke rounded-2xl w-[342px] h-12">
              <Search size={18} color={colors.textSecondary} />
              <Text className="font-inter font-normal text-[13px] text-textSecondary">
                Search teams, leagues...
              </Text>
            </View>
          </View>
          <View className="mb-7 pl-6">
            <Text className="font-inter font-bold text-[17px] text-text mb-[14px]">
              Sports
            </Text>
            {loading ? (
              <ActivityIndicator color={colors.accent} />
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3">
                  {sports.map((sport) => (
                    <SportCategoryTile
                      key={sport.id}
                      label={sport.name}
                      iconColor={SPORT_COLORS[sport.id] ?? colors.textSecondary}
                      onPress={() => router.push(`/sport/${sport.id}` as any)}
                    />
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
          <View className="pl-6 gap-[14px] mb-7">
            <View className="flex-row justify-between items-center pr-6">
              <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-text" />
                <Text className="font-inter font-bold text-[17px] text-text">
                  Live Now
                </Text>
              </View>
              <Text className="font-inter font-semibold text-[13px] text-accent">
                See all
              </Text>
            </View>
            <MatchCardLive
              league="Premier League"
              minute="67'"
              homeTeam="Arsenal"
              homeColor={colors.red}
              awayTeam="Chelsea"
              awayColor={colors.blue}
              homeScore={2}
              awayScore={1}
              onPress={() => router.push('/match/1')}
            />
          </View>
          <View className="px-6 gap-[14px]">
            <View className="flex-row justify-between items-center">
              <Text className="font-inter font-bold text-[17px] text-text">
                Upcoming
              </Text>
              <Text className="font-inter font-semibold text-[13px] text-accent">
                See all
              </Text>
            </View>
            <View className="gap-3">
              <MatchCardUpcoming
                time="18:30"
                date="Today"
                homeTeam="Real Madrid"
                homeColor={colors.yellow}
                awayTeam="Barcelona"
                awayColor={colors.maroon}
                league="LaLiga"
                onPress={() => router.push('/match/2')}
              />
              <MatchCardUpcoming
                time="20:00"
                date="Today"
                homeTeam="Man United"
                homeColor="#DA291C"
                awayTeam="Man City"
                awayColor="#6CABDD"
                league="EPL"
                onPress={() => router.push('/match/3')}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
