import { Text, View } from 'react-native';

import { CustomButton } from '@/components/CustomButton';
import type { CourseCardData } from '@/types/course.types';

type CourseCardProps = {
  course: CourseCardData;
  variant?: 'dark' | 'light';
  ctaLabel?: string;
};

function getProgressWidthClass(progress: number) {
  if (progress >= 100) return 'w-full';
  if (progress >= 90) return 'w-[90%]';
  if (progress >= 80) return 'w-[80%]';
  if (progress >= 70) return 'w-[70%]';
  if (progress >= 60) return 'w-[60%]';
  if (progress >= 50) return 'w-1/2';
  if (progress >= 40) return 'w-[40%]';
  if (progress >= 30) return 'w-[30%]';
  if (progress >= 20) return 'w-[20%]';
  if (progress >= 10) return 'w-[10%]';
  return 'w-[6%]';
}

export function CourseCard({ course, variant = 'dark', ctaLabel = 'Continue' }: CourseCardProps) {
  const isDark = variant === 'dark';
  const safeProgress = Math.max(0, Math.min(100, course.progress));

  return (
    <View
      className={`rounded-[28px] border px-5 py-5 ${
        isDark ? 'border-white/0 bg-ink-950' : 'border-slate-200 bg-white'
      }`}>
      <View className="flex-row items-center justify-between">
        <View className="rounded-full bg-brand-50 px-3 py-2">
          <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-brand-700">
            {course.category}
          </Text>
        </View>
        <Text className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {course.lessonsLeft} lessons left
        </Text>
      </View>

      <Text className={`mt-4 text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>
        {course.title}
      </Text>
      <Text className={`mt-2 text-sm leading-6 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
        {course.instructor}
      </Text>

      <View className="mt-5">
        <View className={`h-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
          <View className={`h-2 rounded-full bg-brand-500 ${getProgressWidthClass(safeProgress)}`} />
        </View>
        <Text className={`mt-2 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {safeProgress}% completed
        </Text>
      </View>

      <CustomButton title={ctaLabel} className="mt-5" />
    </View>
  );
}
