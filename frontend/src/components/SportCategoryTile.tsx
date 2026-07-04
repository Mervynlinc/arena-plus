import { TouchableOpacity, Text, View } from 'react-native';
import IconPlaceholder from './IconPlaceholder';

interface Props {
  label: string;
  iconColor?: string;
  onPress: () => void;
}

export default function SportCategoryTile({ label, iconColor, onPress }: Props) {
  const words = label.split(' ');
  const displayLabel = words.slice(0, 2).join('\n') + (words.length > 2 ? '...' : '');

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="w-24 py-[14px] items-center gap-2 bg-bgCard2 border border-stroke rounded-[18px]"
    >
      <IconPlaceholder size={22} color={iconColor ?? '#2A2A2F'} borderRadius={6} />
      <Text className="font-inter font-semibold text-xs text-textMuted text-center">
        {displayLabel}
      </Text>
    </TouchableOpacity>
  );
}
