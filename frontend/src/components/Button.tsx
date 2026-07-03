import { TouchableOpacity, Text } from 'react-native';
import { colors } from '@/constants/theme';

interface Props {
  variant?: 'primary' | 'secondary' | 'live';
  label: string;
  onPress: () => void;
  fullWidth?: boolean;
  size?: 'sm' | 'md';
}

export default function Button({ variant = 'primary', label, onPress, fullWidth, size = 'md' }: Props) {
  const isSm = size === 'sm';
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        {
          paddingVertical: isSm ? 10 : 16,
          paddingHorizontal: isSm ? 18 : 24,
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
        },
        variant === 'primary' && { backgroundColor: colors.accent },
        variant === 'secondary' && { backgroundColor: colors.bgCard2, borderColor: colors.stroke, borderWidth: 1 },
        variant === 'live' && { backgroundColor: colors.text },
        fullWidth && { width: '100' as unknown as number },
      ]}
    >
      <Text
        style={[
          { fontFamily: 'Inter', fontWeight: '700', fontSize: isSm ? 13 : 16 },
          variant === 'primary' && { color: colors.bg },
          variant === 'secondary' && { color: colors.text },
          variant === 'live' && { color: colors.bg },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
