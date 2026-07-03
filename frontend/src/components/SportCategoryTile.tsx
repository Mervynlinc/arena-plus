import { TouchableOpacity, Text, View } from 'react-native';
import IconPlaceholder from './IconPlaceholder';
import { colors } from '@/constants/theme';

interface Props {
  label: string;
  iconColor?: string;
  onPress: () => void;
}

export default function SportCategoryTile({ label, iconColor, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        paddingVertical: 14,
        paddingHorizontal: 16,
        alignItems: 'center',
        gap: 8,
        backgroundColor: colors.bgCard2,
        borderColor: colors.stroke,
        borderWidth: 1,
        borderRadius: 18,
      }}
    >
      <IconPlaceholder size={22} color={iconColor ?? colors.stroke} borderRadius={6} />
      <Text style={{ fontFamily: 'Inter', fontWeight: '600', fontSize: 12, color: colors.textMuted }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
