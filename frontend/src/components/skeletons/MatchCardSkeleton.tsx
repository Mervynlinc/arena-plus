import { View } from 'react-native';
import Skeleton from './Skeleton';
import { colors } from '@/constants/theme';
import { CARD_WIDTH, CARD_HEIGHT } from '@/components/MatchCardPoster';

export default function MatchCardSkeleton() {
  return (
    <Skeleton
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 18,
        backgroundColor: colors.bgCard2,
      }}
    >
      <View className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-6">
        <View style={{ width: 140, height: 13, borderRadius: 6, backgroundColor: colors.bgCard }} />
        <View className="flex-row justify-between mt-2">
          <View style={{ width: 34, height: 9, borderRadius: 4, backgroundColor: colors.bgCard }} />
          <View style={{ width: 44, height: 9, borderRadius: 4, backgroundColor: colors.bgCard }} />
        </View>
      </View>
    </Skeleton>
  );
}
