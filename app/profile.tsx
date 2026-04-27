import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { CustomButton } from '@/components/CustomButton';
import { useAuthStore } from '@/store/auth.store';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const loadUser = useAuthStore((state) => state.loadUser);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    router.replace('/login');
  }

  async function handleRefreshProfile() {
    setIsRefreshing(true);
    try {
      await loadUser();
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="bg-ink-950 px-5 pb-8 pt-3">
            <AppHeader
              greeting="Student Profile"
              name={user?.name || 'Student'}
              subtitle="Track your growth, achievements, and learning activity."
            />
          </View>

          <View className="-mt-5 rounded-t-[32px] bg-slate-50 px-5 pb-32 pt-6">
            <View className="rounded-[30px] border border-slate-200 bg-white px-5 py-5 shadow-soft">
              <Text className="text-lg font-semibold text-slate-950">Learning summary</Text>

              <View className="mt-5 flex-row gap-3">
                <View className="flex-1 rounded-2xl bg-slate-50 px-4 py-4">
                  <Text className="text-sm text-slate-400">Role</Text>
                  <Text className="mt-2 text-2xl font-bold text-slate-950">{user?.role || 'STUDENT'}</Text>
                </View>
                <View className="flex-1 rounded-2xl bg-slate-50 px-4 py-4">
                  <Text className="text-sm text-slate-400">Email</Text>
                  <Text className="mt-2 text-base font-bold text-slate-950">{user?.email || 'N/A'}</Text>
                </View>
              </View>

              <View className="mt-5 rounded-2xl bg-slate-50 px-4 py-4">
                <Text className="text-sm text-slate-400">Phone</Text>
                <Text className="mt-2 text-base font-semibold text-slate-950">
                  {user?.phone || 'Not added yet'}
                </Text>
              </View>

              <CustomButton
                title="Refresh Profile"
                variant="secondary"
                className="mt-6"
                loading={isRefreshing}
                onPress={handleRefreshProfile}
              />
              <CustomButton
                title="Logout"
                variant="danger"
                className="mt-3"
                loading={isLoggingOut}
                onPress={handleLogout}
              />
            </View>
          </View>
        </ScrollView>

        <BottomNav />
      </View>
    </SafeAreaView>
  );
}
