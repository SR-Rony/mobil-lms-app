import { Text, View } from 'react-native';

type AuthHeaderProps = {
  badge: string;
  title: string;
  subtitle: string;
};

export function AuthHeader({ badge, title, subtitle }: AuthHeaderProps) {
  return (
    <View className="relative overflow-hidden rounded-[36px] bg-ink-950 px-6 pb-16 pt-8">
      <View className="absolute -left-8 top-10 h-32 w-32 rounded-full bg-brand-500/20" />
      <View className="absolute right-0 top-24 h-44 w-44 rounded-full bg-cyan-400/10" />

      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
        <Text className="text-2xl font-bold text-white">O</Text>
      </View>

      <View className="mt-6 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2">
        <Text className="text-xs font-semibold uppercase tracking-[1.6px] text-brand-200">
          {badge}
        </Text>
      </View>

      <Text className="mt-5 max-w-[260px] text-3xl font-bold leading-10 text-white">{title}</Text>
      <Text className="mt-3 max-w-[290px] text-base leading-7 text-slate-300">{subtitle}</Text>
    </View>
  );
}
