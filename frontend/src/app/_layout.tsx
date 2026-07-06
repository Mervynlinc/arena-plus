import "../global.css";

import { Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0C' }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="match/[id]" />
        <Stack.Screen name="sport/[id]" />
        <Stack.Screen name="player" />
        <Stack.Screen name="search" />
      </Stack>
    </View>
  );
}
