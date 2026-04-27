import { Text, View } from 'react-native';

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  invert?: boolean;
};

export function SectionHeader({ title, actionLabel, invert = false }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className={`text-lg font-semibold ${invert ? 'text-white' : 'text-slate-950'}`}>
        {title}
      </Text>
      {actionLabel ? (
        <Text className={`text-sm font-semibold ${invert ? 'text-emerald-50' : 'text-brand-700'}`}>
          {actionLabel}
        </Text>
      ) : null}
    </View>
  );
}
