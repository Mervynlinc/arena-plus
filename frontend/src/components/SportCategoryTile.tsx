import { TouchableOpacity, Text, Image } from 'react-native';

interface Props {
  label: string;
  imageSource: number;
  onPress: () => void;
}

export default function SportCategoryTile({ label, imageSource, onPress }: Props) {
  const words = label.split(' ');
  const displayLabel = words.slice(0, 2).join('\n') + (words.length > 2 ? '...' : '');

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="w-24 py-[14px] items-center gap-2 bg-bgCard2 border border-stroke rounded-[18px]"
    >
      <Image source={imageSource} className="w-[22px] h-[22px]" resizeMode="contain" />
      <Text className="font-inter font-bold text-xs text-textMuted text-center">
        {displayLabel}
      </Text>
    </TouchableOpacity>
  );
}
