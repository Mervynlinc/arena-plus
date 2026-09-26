import "../global.css";

import { useEffect, useState } from "react";
import { Stack, type ErrorBoundaryProps } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Observe, ObserveRoot, useObserve } from "expo-observe";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { NotificationProvider } from "../../context/NotificationContext";
import { logInternalError } from "../lib/apiError";

export const ONBOARDING_FLAG = "hasOnboarded";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  logInternalError(
    "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY (check frontend/.env)",
    "config"
  );
  throw new Error("Configuration error");
}

SplashScreen.preventAutoHideAsync().catch(() => {});

Observe.configure({
  integrations: { "expo-router": true },
});

interface RootNavigatorProps {
  fontsLoaded: boolean;
}

function RootNavigator({ fontsLoaded }: RootNavigatorProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);
  const { markInteractive } = useObserve();

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_FLAG)
      .then((value) => setHasOnboarded(value === "true"))
      .catch(() => setHasOnboarded(false));
  }, []);

  useEffect(() => {
    if (fontsLoaded && hasOnboarded !== null && isLoaded) {
      SplashScreen.hideAsync()
        .catch(() => {})
        .finally(() => markInteractive());
    }
  }, [fontsLoaded, hasOnboarded, isLoaded, markInteractive]);

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

function RootLayout() {
  const [fontsLoaded] = useFonts({
    BebasNeue: require("../../assets/fonts/BebasNeue-Regular.ttf"),
  });

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <NotificationProvider>
        <RootNavigator fontsLoaded={fontsLoaded} />
      </NotificationProvider>
    </ClerkProvider>
  );
}

export default ObserveRoot.wrap(RootLayout);

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    logInternalError(error, "route-render");
  }, [error]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0A0A0C",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
      }}
    >
      <Text
        style={{
          color: "#F5F5F7",
          fontSize: 18,
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        Something went wrong
      </Text>
      <Text
        style={{
          color: "#8E8E93",
          fontSize: 14,
          marginTop: 8,
          textAlign: "center",
        }}
      >
        Please try again.
      </Text>
      <TouchableOpacity
        onPress={retry}
        accessibilityRole="button"
        style={{
          marginTop: 24,
          paddingVertical: 12,
          paddingHorizontal: 32,
          borderRadius: 12,
          backgroundColor: "rgba(255,255,255,0.1)",
        }}
      >
        <Text style={{ color: "#F5F5F7", fontWeight: "600" }}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
}
