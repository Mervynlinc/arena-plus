import { View, Text, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/theme';
import CategoryPill from '@/components/CategoryPill';
import StreamRow from '@/components/StreamRow';

const streams = [
  { serverName: 'Server Alpha', quality: 'HD', language: 'EN', tag: 'Verified' },
  { serverName: 'Server Bravo', quality: '4K', language: 'ES', tag: 'Verified' },
  { serverName: 'Server Charlie', quality: 'HD', language: 'FR', tag: 'Backup' },
];

const tabs = ['Game', 'Line-up', 'Stats', 'Info'];

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: colors.bgCard, paddingTop: 60, paddingHorizontal: 24, alignItems: 'center', gap: 28, height: 320 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 342 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.bgCard2,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text onPress={() => router.back()} style={{ fontSize: 18, color: colors.textSecondary }}>
              ←
            </Text>
          </View>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.bgCard2,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18, color: colors.textSecondary }}>
              ⤴
            </Text>
          </View>
        </View>
        <Text style={{ fontFamily: 'Inter', fontWeight: '600', fontSize: 13, color: colors.textMuted }}>
          Premier League · Matchweek 12
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 28 }}>
          <View style={{ alignItems: 'center', gap: 8 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.red }} />
            <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 15, color: colors.text }}>
              Arsenal
            </Text>
          </View>
          <View style={{ alignItems: 'center', gap: 6 }}>
            <View
              style={{
                paddingVertical: 5,
                paddingHorizontal: 10,
                backgroundColor: colors.liveRed,
                borderRadius: 100,
              }}
            >
              <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 11, color: colors.text }}>
                ● LIVE 67'
              </Text>
            </View>
            <Text style={{ fontFamily: 'Inter', fontWeight: '800', fontSize: 44, color: colors.text }}>
              2 - 1
            </Text>
          </View>
          <View style={{ alignItems: 'center', gap: 8 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.blue }} />
            <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 15, color: colors.text }}>
              Chelsea
            </Text>
          </View>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 100 }}>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
            {tabs.map((tab, i) => (
              <CategoryPill key={tab} label={tab} active={tab === 'Game'} onPress={() => {}} />
            ))}
          </View>
          <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 17, color: colors.text, marginBottom: 14 }}>
            Available Streams
          </Text>
          <View style={{ gap: 14 }}>
            {streams.map((stream) => (
              <StreamRow key={stream.serverName} {...stream} onPress={() => {}} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
