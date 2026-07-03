import { View, Text, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/theme';
import SportCategoryTile from '@/components/SportCategoryTile';
import MatchCardLive from '@/components/MatchCardLive';
import MatchCardUpcoming from '@/components/MatchCardUpcoming';

const sports = [
  { label: 'Football', iconColor: colors.accent },
  { label: 'Basketball', iconColor: '#E8772E' },
  { label: 'Tennis', iconColor: '#4CAF50' },
  { label: 'Cricket', iconColor: '#2196F3' },
  { label: 'Motorsport', iconColor: '#9C27B0' },
];

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: 60, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <View style={{ gap: 2 }}>
            <Text style={{ fontFamily: 'Inter', fontWeight: '500', fontSize: 12, color: colors.textSecondary }}>
              Good evening
            </Text>
            <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 20, color: colors.text }}>
              Welcome back, Brown
            </Text>
          </View>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.bgCard2,
              borderColor: colors.accent,
              borderWidth: 1.5,
            }}
          />
        </View>
        <View style={{ paddingHorizontal: 24, marginBottom: 28 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingVertical: 14,
              paddingHorizontal: 16,
              backgroundColor: colors.bgCard2,
              borderColor: colors.stroke,
              borderWidth: 1,
              borderRadius: 16,
              width: 342,
              height: 48,
            }}
          >
            <View style={{ width: 18, height: 18, backgroundColor: colors.stroke, borderRadius: 4 }} />
            <Text style={{ fontFamily: 'Inter', fontWeight: '400', fontSize: 13, color: colors.textSecondary }}>
              Search teams, leagues...
            </Text>
          </View>
        </View>
        <View style={{ marginBottom: 28, paddingLeft: 24 }}>
          <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 17, color: colors.text, marginBottom: 14 }}>
            Sports
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {sports.map((sport) => (
                <SportCategoryTile key={sport.label} label={sport.label} iconColor={sport.iconColor} onPress={() => {}} />
              ))}
            </View>
          </ScrollView>
        </View>
        <View style={{ paddingLeft: 24, gap: 14, marginBottom: 28 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.text }} />
              <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 17, color: colors.text }}>
                Live Now
              </Text>
            </View>
            <Text style={{ fontFamily: 'Inter', fontWeight: '600', fontSize: 13, color: colors.accent }}>
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
        <View style={{ paddingHorizontal: 24, gap: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 17, color: colors.text }}>
              Upcoming
            </Text>
            <Text style={{ fontFamily: 'Inter', fontWeight: '600', fontSize: 13, color: colors.accent }}>
              See all
            </Text>
          </View>
          <View style={{ gap: 12 }}>
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
      </ScrollView>
    </View>
  );
}
