import { TouchableOpacity, Text } from 'react-native';
import { colors } from '@/constants/theme';

interface Props {
  label: string;
  active?: boolean;
  onPress: () => void;
}

export default function CategoryPill({ label, active, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        paddingVertical: 9,
        paddingHorizontal: 16,
        borderRadius: 100,
        backgroundColor: active ? colors.accent : colors.bgCard2,
        borderWidth: active ? 0 : 1,
        borderColor: colors.stroke,
      }}
    >
      <Text
        style={{
          fontFamily: 'Inter',
          fontWeight: '600',
          fontSize: 13,
          color: active ? colors.bg : colors.textMuted,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
