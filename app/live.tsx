import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { CustomButton } from '@/components/CustomButton';
import { SectionHeader } from '@/components/SectionHeader';
import { dashboardService } from '@/services/dashboard.service';
import { getApiErrorMessage } from '@/services/api';
import type { UpcomingLiveClass } from '@/types/dashboard.types';

export default function LiveScreen() {
  const [liveClass, setLiveClass] = useState<UpcomingLiveClass | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadLiveClass() {
    try {
      const dashboard = await dashboardService.getDashboard();
      setLiveClass(dashboard.upcomingLiveClass);
      setError(null);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  useEffect(() => {
    loadLiveClass();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="bg-ink-950 px-5 pb-8 pt-3">
            <AppHeader
              greeting="Live Classes"
              name="Join Sessions"
              subtitle="Stay connected with mentors through live classes and Q&A."
            />
          </View>

          <View className="-mt-5 rounded-t-[32px] bg-slate-50 px-5 pb-32 pt-6">
            <View className="rounded-[30px] bg-emerald-500 px-5 py-5">
              <SectionHeader
                title="Tonight's featured class"
                actionLabel={liveClass ? 'Synced from backend' : 'Coming soon'}
                invert
              />
              <Text className="mt-4 text-2xl font-bold text-white">
                {liveClass?.title || 'No live class scheduled'}
              </Text>
              <Text className="mt-2 text-sm leading-6 text-emerald-50">
                {liveClass
                  ? `${liveClass.teacher} • ${new Date(liveClass.startsAt).toLocaleString()} • ${liveClass.platform}`
                  : 'Your next live session will appear here once it is scheduled.'}
              </Text>
              <View className="mt-5 flex-row items-center rounded-2xl bg-white/15 px-4 py-4">
                <Ionicons name="mic-outline" size={20} color="#ffffff" />
                <Text className="ml-3 flex-1 text-sm font-medium text-white">
                  {error || 'Interactive voice practice with real-time mentor feedback'}
                </Text>
              </View>
            </View>

            <View className="mt-6 rounded-[30px] border border-slate-200 bg-white px-5 py-5 shadow-soft">
              <Text className="text-lg font-semibold text-slate-950">Upcoming sessions</Text>
              {liveClass ? (
                <View className="mt-4 gap-4">
                  <View className="rounded-2xl bg-slate-50 px-4 py-4">
                    <Text className="text-base font-semibold text-slate-950">{liveClass.title}</Text>
                    <Text className="mt-1 text-sm text-slate-500">
                      {new Date(liveClass.startsAt).toLocaleString()}
                    </Text>
                  </View>
                </View>
              ) : (
                <View className="mt-4 rounded-2xl bg-slate-50 px-4 py-4">
                  <Text className="text-sm leading-6 text-slate-500">
                    No additional sessions are available right now.
                  </Text>
                </View>
              )}

              {error ? <CustomButton title="Retry" className="mt-5" onPress={loadLiveClass} /> : null}
            </View>
          </View>
        </ScrollView>

        <BottomNav />
      </View>
    </SafeAreaView>
  );
}
