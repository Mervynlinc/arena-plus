import { TouchableOpacity, Text } from 'react-native';

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
      className={`py-[9px] px-4 rounded-full ${active ? 'bg-accent' : 'bg-bgCard2 border border-stroke'}`}
    >
      <Text
        className={`font-inter font-semibold text-[13px] ${active ? 'text-bg' : 'text-textMuted'}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
