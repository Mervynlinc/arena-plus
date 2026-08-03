import { View } from 'react-native';
import Skeleton from './Skeleton';
import { colors } from '@/constants/theme';

export default function MatchRowSkeleton() {
  return (
    <Skeleton
      style={{
        width: '100%',
        height: 76,
        borderRadius: 18,
        backgroundColor: colors.bgCard2,
        borderWidth: 1,
        borderColor: colors.stroke,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <View style={{ alignItems: 'center', gap: 4, paddingRight: 14 }}>
        <View style={{ width: 34, height: 12, borderRadius: 6, backgroundColor: colors.bgCard }} />
        <View style={{ width: 26, height: 9, borderRadius: 4, backgroundColor: colors.bgCard }} />
      </View>
      <View style={{ flex: 1, gap: 8 }}>
        <View style={{ width: '70%', height: 11, borderRadius: 5, backgroundColor: colors.bgCard }} />
        <View style={{ width: '52%', height: 11, borderRadius: 5, backgroundColor: colors.bgCard }} />
      </View>
      <View style={{ width: 40, height: 18, borderRadius: 9, backgroundColor: colors.bgCard }} />
    </Skeleton>
  );
}
