import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { colors } from '@/constants/theme';

function TabIcon({ focused, label }: { focused: boolean; label: string }) {
  return (
    <View style={{ alignItems: 'center', gap: 4, paddingTop: 8 }}>
      <View
        style={{
          width: 24,
          height: 24,
          backgroundColor: colors.stroke,
          borderRadius: 6,
        }}
      />
      <Text
        style={{
          fontFamily: 'Inter',
          fontWeight: '600' as const,
          fontSize: 11,
          color: focused ? colors.accent : colors.textSecondary,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgCard,
          borderTopColor: colors.stroke,
          borderTopWidth: 1,
          height: 88,
          paddingBottom: 28,
          paddingHorizontal: 24,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Home" />,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Matches" />,
        }}
      />
      <Tabs.Screen
        name="watch"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Watch" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Settings" />,
        }}
      />
    </Tabs>
  );
}
