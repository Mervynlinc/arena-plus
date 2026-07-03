import { View, Text } from 'react-native';
import { colors } from '@/constants/theme';

export default function WatchScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 17, color: colors.textSecondary }}>
        Watch
      </Text>
    </View>
  );
}
