import '../global.css';

import { useEffect } from 'react';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuthStore } from '@/store/auth.store';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const initialize = useAuthStore((state) => state.initialize);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isBootstrapping) {
      return;
    }

    const publicRoutes = ['/', '/login', '/register', '/forgot-password'];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isAuthenticated && !isPublicRoute) {
      router.replace('/login');
      return;
    }

    if (isAuthenticated && isPublicRoute) {
      router.replace('/home');
    }
  }, [isAuthenticated, isBootstrapping, pathname, router]);

  if (isBootstrapping) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 items-center justify-center bg-slate-50 px-6">
          <View className="rounded-[28px] bg-white px-6 py-6 shadow-soft">
            <Text className="text-center text-lg font-semibold text-slate-950">
              Restoring your session...
            </Text>
            <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
              Please wait while we connect your LMS account.
            </Text>
          </View>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="home" />
          <Stack.Screen name="courses" />
          <Stack.Screen name="live" />
          <Stack.Screen name="profile" />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
