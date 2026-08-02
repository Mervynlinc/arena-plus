import "../global.css";

import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ONBOARDING_FLAG = "hasOnboarded";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BebasNeue: require("../../assets/fonts/BebasNeue-Regular.ttf"),
  });
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_FLAG)
      .then((value) => setHasOnboarded(value === "true"))
      .catch(() => setHasOnboarded(false));
  }, []);

  useEffect(() => {
    if (fontsLoaded && hasOnboarded !== null) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, hasOnboarded]);

  if (!fontsLoaded || hasOnboarded === null) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0C' }}>
      <Stack screenOptions={{ headerShown: false }} initialRouteName={hasOnboarded ? "(tabs)" : "index"}>
        <Stack.Screen name="index" redirect={hasOnboarded} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="match/[id]" />
        <Stack.Screen name="sport/[id]" />
        <Stack.Screen name="player" />
        <Stack.Screen name="search" />
      </Stack>
    </View>
  );
}
