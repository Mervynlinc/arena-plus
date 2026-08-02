import { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity, Animated, Easing, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image as ExpoImage } from 'expo-image';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '@/components/Button';
import ScreenContainer from '@/components/ScreenContainer';
import { ONBOARDING_FLAG } from './_layout';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    image: require('../../assets/images/onboarding_1.jpeg'),
    title: 'Every Match.\nOne Tap Away.',
    desc: 'Discover live and upcoming fixtures across football, basketball, tennis and more — then jump straight into the broadcast.',
  },
  {
    image: require('../../assets/images/onboarding_2.png'),
    title: 'Live Scores &\nUpdates',
    desc: 'Follow the game as it happens with real-time scores, stats, and match updates delivered straight to your device.',
  },
  {
    image: require('../../assets/images/onboarding_3.jpeg'),
    title: 'Never Miss\na Game',
    desc: 'Save your favorite teams and leagues to get notified when they play and stay on top of every moment.',
  },
];

export default function OnboardingScreen() {
  const [page, setPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const [textAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    textAnim.setValue(0);
    Animated.timing(textAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [page, textAnim]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    if (index !== page) setPage(index);
  };

  const slideUp = textAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [36, 0],
  });

  const finishOnboarding = () => {
    AsyncStorage.setItem(ONBOARDING_FLAG, 'true')
      .catch(() => {})
      .finally(() => router.replace('/(tabs)'));
  };

  const goNext = () => {
    if (page < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: (page + 1) * width, animated: true });
    } else {
      finishOnboarding();
    }
  };

  return (
    <ScreenContainer>
      <TouchableOpacity
        onPress={finishOnboarding}
        activeOpacity={0.7}
        className="absolute right-5 z-10 py-[6px] px-4 bg-bgCard2/70 border border-stroke rounded-full"
        style={{ top: 56 }}
      >
        <Text className="font-inter font-semibold text-[13px] text-textSecondary">
          Skip
        </Text>
      </TouchableOpacity>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
      >
        {slides.map((s, i) => {
          const src = Image.resolveAssetSource(s.image);
          const imgAspect = src ? src.width / src.height : width / height;
          const screenAspect = width / height;
          const imgWidth = imgAspect > screenAspect ? width : height * imgAspect;
          const imgHeight = imgAspect > screenAspect ? width / imgAspect : height;
          return (
            <View key={i} style={{ width, height }}>
              <ExpoImage
                source={s.image}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                contentFit="cover"
                blurRadius={30}
              />
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image
                  source={s.image}
                  style={{ width: imgWidth, height: imgHeight }}
                  resizeMode="contain"
                />
              </View>
              <LinearGradient
                colors={['rgba(10,10,12,0.45)', 'rgba(10,10,12,0.12)', 'rgba(10,10,12,0.92)']}
                locations={[0, 0.35, 1]}
                className="absolute inset-0"
              />
              <Animated.View
                className="absolute left-6 right-6 gap-4 items-center"
                style={{ bottom: 190, opacity: textAnim, transform: [{ translateY: slideUp }] }}
              >
                <Text className="font-display text-[40px] leading-[42px] text-text text-center">
                  {s.title}
                </Text>
                <Text className="font-inter font-normal text-sm leading-[21px] text-textMuted text-center">
                  {s.desc}
                </Text>
              </Animated.View>
            </View>
          );
        })}
      </ScrollView>

      <View className="absolute left-6 right-6 bottom-[50px] gap-4">
        <Button
          label={page < slides.length - 1 ? 'Next' : 'Get Started'}
          onPress={goNext}
          fullWidth
        />
        <View className="flex-row justify-center gap-[6px]">
          {slides.map((_, i) => (
            <View
              key={i}
              className={`${i === page ? 'w-[18px] bg-accent' : 'w-[6px] bg-stroke'} h-[6px] rounded-[3px]`}
            />
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}
