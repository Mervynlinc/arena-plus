import { useState, useRef } from 'react';
import { View, Text, ScrollView, Image, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Button from '@/components/Button';
import ScreenContainer from '@/components/ScreenContainer';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.55;

const slides = [
  {
    image: require('../../assets/images/onboarding_1.png'),
    badge: 'GLOBAL LIVE SPORTS',
    title: 'Every Match.\nOne Tap Away.',
    desc: 'Discover live and upcoming fixtures across football, basketball, tennis and more — then jump straight into the broadcast.',
  },
  {
    image: require('../../assets/images/onboarding_2.png'),
    badge: 'REAL-TIME ACTION',
    title: 'Live Scores &\nUpdates',
    desc: 'Follow the game as it happens with real-time scores, stats, and match updates delivered straight to your device.',
  },
  {
    image: require('../../assets/images/onboarding_3.png'),
    badge: 'YOUR FAVORITES',
    title: 'Never Miss\na Game',
    desc: 'Save your favorite teams and leagues to get notified when they play and stay on top of every moment.',
  },
];

export default function OnboardingScreen() {
  const [page, setPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    if (index !== page) setPage(index);
  };

  const goNext = () => {
    if (page < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: (page + 1) * width, animated: true });
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <ScreenContainer>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
      >
        {slides.map((s, i) => (
          <View key={i} style={{ width, minHeight: height }}>
            <LinearGradient
              colors={['#FFFFFF', '#0A0A0C']}
              className="absolute inset-0"
            />
            <Image
              source={s.image}
              style={{ width, height: IMAGE_HEIGHT }}
              resizeMode="cover"
            />
            <View className="px-6 pt-8 gap-4">
              <View className="py-[6px] px-3 self-start bg-bgCard2 border border-stroke rounded-full">
                <Text className="font-inter font-bold text-[10px] tracking-[1.5px] text-accent">
                  {s.badge}
                </Text>
              </View>
              <Text className="font-inter font-extrabold text-[34px] leading-[38px] text-text">
                {s.title}
              </Text>
              <Text className="font-inter font-normal text-sm leading-[21px] text-textMuted">
                {s.desc}
              </Text>
            </View>
          </View>
        ))}
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
