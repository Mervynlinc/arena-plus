import { TouchableOpacity, Text } from 'react-native';

interface Props {
  label: string;
  emoji: string;
  onPress: () => void;
}

export default function SportCategoryTile({ label, emoji, onPress }: Props) {
  const words = label.split(' ');
  const displayLabel = words.slice(0, 2).join('\n') + (words.length > 2 ? '...' : '');

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="w-24 py-[14px] items-center gap-2 bg-bgCard2 border border-stroke rounded-[18px]"
    >
      <Text className="text-[24px] leading-[24px]">{emoji}</Text>
      <Text className="font-inter font-bold text-xs text-textMuted text-center">
        {displayLabel}
      </Text>
    </TouchableOpacity>
  );
}
