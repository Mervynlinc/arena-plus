import { View } from 'react-native';
import Skeleton from './Skeleton';
import { colors } from '@/constants/theme';

export default function SportTileSkeleton() {
  return (
    <Skeleton
      style={{
        width: 96,
        borderRadius: 18,
        backgroundColor: colors.bgCard2,
        paddingVertical: 14,
        alignItems: 'center',
        gap: 8,
      }}
    >
      <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.bgCard }} />
      <View style={{ width: 56, height: 12, borderRadius: 6, backgroundColor: colors.bgCard }} />
      <View style={{ width: 40, height: 12, borderRadius: 6, backgroundColor: colors.bgCard }} />
    </Skeleton>
  );
}
