import { View } from 'react-native';

interface Props {
  size?: number;
  color?: string;
  borderRadius?: number;
}

export default function IconPlaceholder({ size = 24, color = '#2A2A2F', borderRadius = 6 }: Props) {
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius,
      }}
    />
  );
}
