import type { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

type AppHeaderProps = {
  greeting: string;
  name: string;
  subtitle: string;
  rightSlot?: ReactNode;
};

export function AppHeader({ greeting, name, subtitle, rightSlot }: AppHeaderProps) {
  return (
    <View className="flex-row items-start justify-between">
      <View className="flex-1 pr-4">
        <Text className="text-sm font-semibold uppercase tracking-[1.8px] text-slate-400">
          {greeting}
        </Text>
        <Text className="mt-2 text-3xl font-bold text-white">{name}</Text>
        <Text className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</Text>
      </View>

      {rightSlot ?? (
        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
          <Ionicons name="notifications-outline" size={24} color="#ffffff" />
        </View>
      )}
    </View>
  );
}
