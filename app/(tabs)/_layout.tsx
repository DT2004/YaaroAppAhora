import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const colors = {
  primary: '#6B2FB3',
  primaryLight: '#F6F2F9',
  secondary: '#F8F4FB',
  text: '#1A1A1A',
  textSecondary: '#666666',
  white: '#FFFFFF',
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: 'rgba(0, 0, 0, 0.1)',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Yaaro Events',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Spontaneous',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="lightning-bolt" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
