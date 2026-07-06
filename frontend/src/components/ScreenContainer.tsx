import { View, Image } from 'react-native';

interface Props {
  children: React.ReactNode;
}

export default function ScreenContainer({ children }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require('@/assets/images/app_background.png')}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        resizeMode="cover"
      />
      {children}
    </View>
  );
}