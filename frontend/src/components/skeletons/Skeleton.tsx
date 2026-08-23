import { useEffect, useState } from 'react';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';

const BASE_OPACITY = 0.5;
const PULSE_MS = 800;

interface Props {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export default function Skeleton({ style, children }: Props) {
  const [opacity] = useState(() => new Animated.Value(BASE_OPACITY));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: PULSE_MS,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: BASE_OPACITY,
          duration: PULSE_MS,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[style, { opacity, overflow: 'hidden' }]}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {children}
    </Animated.View>
  );
}
