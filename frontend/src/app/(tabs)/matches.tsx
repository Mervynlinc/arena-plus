import { View, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/theme';
import CategoryPill from '@/components/CategoryPill';
import MatchCardLive from '@/components/MatchCardLive';
import MatchCardUpcoming from '@/components/MatchCardUpcoming';

const dayTabs = ['All', 'Yesterday', 'Today', 'Tomorrow'];

export default function MatchesScreen() {
  return (
    <View className="flex-1 bg-bg">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="pt-[60px] px-6 pb-[100px]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="font-inter font-bold text-2xl text-text">
              Matches
            </Text>
            <View className="w-11 h-11 rounded-[14px] bg-bgCard2 justify-center items-center">
              <Text className="text-lg text-accent">⚙</Text>
            </View>
          </View>
          <View className="flex-row gap-[10px] mb-6">
            {dayTabs.map((day, i) => (
              <CategoryPill key={day} label={day} active={day === 'Today'} onPress={() => {}} />
            ))}
          </View>
          <View className="gap-6">
            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  <View className="w-[22px] h-[22px] rounded-full bg-accent" />
                  <Text className="font-inter font-bold text-[15px] text-text">
                    Premier League
                  </Text>
                </View>
                <Text className="font-inter font-medium text-xs text-textSecondary">
                  3 matches
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
            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  <View className="w-[22px] h-[22px] rounded-full bg-accent" />
                  <Text className="font-inter font-bold text-[15px] text-text">
                    LaLiga
                  </Text>
                </View>
                <Text className="font-inter font-medium text-xs text-textSecondary">
                  2 matches
                </Text>
              </View>
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
                time="21:15"
                date="Today"
                homeTeam="Atletico Madrid"
                homeColor="#CB3524"
                awayTeam="Sevilla"
                awayColor="#D4021D"
                league="LaLiga"
                onPress={() => router.push('/match/4')}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
