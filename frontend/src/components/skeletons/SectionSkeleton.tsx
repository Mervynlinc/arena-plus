import { View } from 'react-native';
import Skeleton from './Skeleton';
import MatchCardSkeleton from './MatchCardSkeleton';
import { colors } from '@/constants/theme';

interface Props {
  count?: number;
}

export default function SectionSkeleton({ count = 2 }: Props) {
  return (
    <View className="mb-6 pl-6">
      <Skeleton style={{ width: 90, height: 17, borderRadius: 6, backgroundColor: colors.bgCard2, marginBottom: 14 }} />
      <View className="flex-row gap-3 pr-6">
        {Array.from({ length: count }).map((_, i) => (
          <MatchCardSkeleton key={i} />
        ))}
      </View>
    </View>
  );
}
