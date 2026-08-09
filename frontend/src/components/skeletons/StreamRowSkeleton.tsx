import { View } from 'react-native';
import Skeleton from './Skeleton';
import { colors } from '@/constants/theme';

export default function StreamRowSkeleton() {
  return (
    <Skeleton
      style={{
        width: '100%',
        borderRadius: 16,
        backgroundColor: colors.bgCard2,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.bgCard }} />
      <View style={{ flex: 1, gap: 7 }}>
        <View style={{ width: '45%', height: 12, borderRadius: 6, backgroundColor: colors.bgCard }} />
        <View style={{ width: '70%', height: 10, borderRadius: 5, backgroundColor: colors.bgCard }} />
      </View>
      <View style={{ width: 72, height: 36, borderRadius: 12, backgroundColor: colors.bgCard }} />
    </Skeleton>
  );
}
