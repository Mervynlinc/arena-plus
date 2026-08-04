import "../global.css";

import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";

export const ONBOARDING_FLAG = "hasOnboarded";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to frontend/.env");
}

SplashScreen.preventAutoHideAsync().catch(() => {});

interface RootNavigatorProps {
  fontsLoaded: boolean;
}

function RootNavigator({ fontsLoaded }: RootNavigatorProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_FLAG)
      .then((value) => setHasOnboarded(value === "true"))
      .catch(() => setHasOnboarded(false));
  }, []);

  useEffect(() => {
    if (fontsLoaded && hasOnboarded !== null && isLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, hasOnboarded, isLoaded]);

  if (!fontsLoaded || hasOnboarded === null || !isLoaded) return null;

  const initialRouteName = !hasOnboarded
    ? "index"
    : isSignedIn
      ? "(tabs)"
      : "(auth)/signin";

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0C' }}>
      <Stack screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
        <Stack.Screen name="index" redirect={hasOnboarded} />
        <Stack.Screen name="(auth)/signin" />
        <Stack.Screen name="(auth)/signup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="match/[id]" />
        <Stack.Screen name="sport/[id]" />
        <Stack.Screen name="player" />
        <Stack.Screen name="search" />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BebasNeue: require("../../assets/fonts/BebasNeue-Regular.ttf"),
  });

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <RootNavigator fontsLoaded={fontsLoaded} />
    </ClerkProvider>
  );
}
