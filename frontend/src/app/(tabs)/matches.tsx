import { View, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/theme';
import CategoryPill from '@/components/CategoryPill';
import MatchCardLive from '@/components/MatchCardLive';
import MatchCardUpcoming from '@/components/MatchCardUpcoming';

const dayTabs = ['All', 'Yesterday', 'Today', 'Tomorrow'];

export default function MatchesScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: 60, paddingHorizontal: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 24, color: colors.text }}>
            Matches
          </Text>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: colors.bgCard2,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18, color: colors.accent }}>⚙</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
          {dayTabs.map((day, i) => (
            <CategoryPill key={day} label={day} active={day === 'Today'} onPress={() => {}} />
          ))}
        </View>
        <View style={{ gap: 24 }}>
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.accent }} />
                <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 15, color: colors.text }}>
                  Premier League
                </Text>
              </View>
              <Text style={{ fontFamily: 'Inter', fontWeight: '500', fontSize: 12, color: colors.textSecondary }}>
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
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.accent }} />
                <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 15, color: colors.text }}>
                  LaLiga
                </Text>
              </View>
              <Text style={{ fontFamily: 'Inter', fontWeight: '500', fontSize: 12, color: colors.textSecondary }}>
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
      </ScrollView>
    </View>
  );
}
