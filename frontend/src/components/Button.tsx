import { TouchableOpacity, Text } from 'react-native';

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
      className={`rounded-2xl justify-center items-center ${isSm ? 'py-[10px] px-[18px]' : 'py-4 px-6'} ${
        variant === 'primary' ? 'bg-accent' : variant === 'secondary' ? 'bg-bgCard2 border border-stroke' : 'bg-text'
      } ${fullWidth ? 'w-full' : ''}`}
    >
      <Text
        className={`font-inter font-bold ${isSm ? 'text-[13px]' : 'text-base'} ${
          variant === 'primary' ? 'text-bg' : variant === 'secondary' ? 'text-text' : 'text-bg'
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
