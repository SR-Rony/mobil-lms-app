import { Ionicons } from '@expo/vector-icons';
import { useDeferredValue, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { CourseCard } from '@/components/CourseCard';
import { CustomButton } from '@/components/CustomButton';
import { SectionHeader } from '@/components/SectionHeader';
import { courseService } from '@/services/course.service';
import { dashboardService } from '@/services/dashboard.service';
import { enrollmentService } from '@/services/enrollment.service';
import { getApiErrorMessage } from '@/services/api';
import { useAuthStore } from '@/store/auth.store';
import type { DashboardData } from '@/types/dashboard.types';
import type { Course, CourseCardData, CourseCategory } from '@/types/course.types';
import type { Enrollment } from '@/types/enrollment.types';

function mapEnrollmentToCard(enrollment: Enrollment): CourseCardData {
  const lessonCount = enrollment.course.lessons.length;

  return {
    id: enrollment.id,
    title: enrollment.course.title,
    instructor: `${enrollment.course.level} • ${enrollment.course.duration}`,
    category: enrollment.course.category.name,
    progress: enrollment.progress,
    lessonsLeft: Math.max(lessonCount - Math.round((lessonCount * enrollment.progress) / 100), 0),
  };
}

function mapCourseToCard(course: Course): CourseCardData {
  return {
    id: course.id,
    title: course.title,
    instructor: `${course.level} • ${course.duration}`,
    category: course.category.name,
    progress: 0,
    lessonsLeft: course.lessons.length,
  };
}

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [myCourses, setMyCourses] = useState<Enrollment[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCourseLoading, setIsCourseLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search);

  async function loadOverview() {
    setIsLoading(true);
    setError(null);

    try {
      const [dashboardData, categoriesData, myCoursesData, coursesData] = await Promise.all([
        dashboardService.getDashboard(),
        courseService.getCategories(),
        enrollmentService.getMyCourses(),
        courseService.getCourses(),
      ]);

      setDashboard(dashboardData);
      setCategories(categoriesData);
      setMyCourses(myCoursesData);
      setCourses(coursesData);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  async function loadCourses() {
    setIsCourseLoading(true);

    try {
      const courseData = await courseService.getCourses({
        search: deferredSearch.trim(),
        category: selectedCategory,
      });
      setCourses(courseData);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsCourseLoading(false);
    }
  }

  useEffect(() => {
    loadOverview();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      loadCourses();
    }
  }, [deferredSearch, selectedCategory]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 px-6">
        <View className="rounded-[28px] bg-white px-6 py-6 shadow-soft">
          <Text className="text-center text-lg font-semibold text-slate-950">
            Loading your dashboard
          </Text>
          <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
            We&apos;re fetching your real course progress, categories, and live session data.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 px-6">
        <View className="w-full rounded-[28px] bg-white px-6 py-6 shadow-soft">
          <Text className="text-center text-lg font-semibold text-slate-950">
            Couldn&apos;t load your dashboard
          </Text>
          <Text className="mt-2 text-center text-sm leading-6 text-slate-500">{error}</Text>
          <CustomButton title="Try Again" className="mt-5" onPress={loadOverview} />
        </View>
      </SafeAreaView>
    );
  }

  const continueLearning = dashboard?.continueLearning;
  const displayedMyCourses = myCourses.length ? myCourses : dashboard?.myCourses || [];
  const displayedCategories = categories.length ? categories : dashboard?.categories || [];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="bg-ink-950 px-5 pb-8 pt-3">
            <AppHeader
              greeting="Assalamu Alaikum"
              name={user?.name || 'Student'}
              subtitle="Ready to continue your skill-building streak today?"
            />

            <View className="mt-6 rounded-[28px] bg-white/8 px-4 py-4">
              <View className="flex-row items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <Ionicons name="search-outline" size={18} color="#94a3b8" />
                <TextInput
                  placeholder="Search courses, mentors, live batches"
                  placeholderTextColor="#94a3b8"
                  className="ml-3 flex-1 text-[15px] text-white"
                  value={search}
                  onChangeText={setSearch}
                />
              </View>

              <View className="mt-5 flex-row flex-wrap gap-3">
                <Pressable
                  onPress={() => setSelectedCategory('')}
                  className={`rounded-full border px-4 py-2 ${
                    selectedCategory === '' ? 'border-brand-300 bg-brand-500/20' : 'border-white/10 bg-white/10'
                  }`}>
                  <Text className="text-sm font-medium text-slate-200">All Courses</Text>
                </Pressable>
                {displayedCategories.map((category) => (
                  <Pressable
                    key={category.id}
                    onPress={() => setSelectedCategory(category.slug)}
                    className={`rounded-full border px-4 py-2 ${
                      selectedCategory === category.slug
                        ? 'border-brand-300 bg-brand-500/20'
                        : 'border-white/10 bg-white/10'
                    }`}>
                    <Text className="text-sm font-medium text-slate-200">{category.name}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <View className="-mt-5 rounded-t-[32px] bg-slate-50 px-5 pb-32 pt-6">
            <View className="rounded-[30px] bg-brand-600 px-5 py-5">
              <Text className="text-sm font-semibold uppercase tracking-[1.8px] text-brand-100">
                Continue learning
              </Text>
              {continueLearning ? (
                <>
                  <Text className="mt-3 text-2xl font-bold text-white">
                    {continueLearning.course.title}
                  </Text>
                  <Text className="mt-2 text-sm leading-6 text-brand-100">
                    {continueLearning.course.category.name} • {continueLearning.course.lessons.length} lessons
                  </Text>
                </>
              ) : (
                <Text className="mt-3 text-base leading-7 text-brand-50">
                  You haven&apos;t enrolled in any course yet. Browse the catalog and start learning.
                </Text>
              )}

              <View className="mt-5 rounded-2xl bg-white/15 px-4 py-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-medium text-brand-50">Overall progress</Text>
                  <Text className="text-sm font-semibold text-white">
                    {continueLearning?.progress ?? 0}%
                  </Text>
                </View>
                <View className="mt-3 h-2 rounded-full bg-white/20">
                  <View
                    className={`h-2 rounded-full bg-white ${
                      continueLearning
                        ? continueLearning.progress >= 80
                          ? 'w-[80%]'
                          : continueLearning.progress >= 60
                            ? 'w-[60%]'
                            : continueLearning.progress >= 40
                              ? 'w-[40%]'
                              : continueLearning.progress >= 20
                                ? 'w-[20%]'
                                : 'w-[8%]'
                        : 'w-[8%]'
                    }`}
                  />
                </View>
              </View>
            </View>

            <View className="mt-6 rounded-[30px] border border-slate-200 bg-white px-5 py-5 shadow-soft">
              <SectionHeader title="Your progress" actionLabel="Real stats" />
              <View className="mt-4 flex-row gap-3">
                <View className="flex-1 rounded-2xl bg-slate-50 px-4 py-4">
                  <Text className="text-sm text-slate-400">Enrolled courses</Text>
                  <Text className="mt-2 text-2xl font-bold text-slate-950">
                    {dashboard?.stats.enrolledCourses ?? 0}
                  </Text>
                </View>
                <View className="flex-1 rounded-2xl bg-slate-50 px-4 py-4">
                  <Text className="text-sm text-slate-400">Average progress</Text>
                  <Text className="mt-2 text-2xl font-bold text-slate-950">
                    {dashboard?.stats.averageProgress ?? 0}%
                  </Text>
                </View>
              </View>
              <View className="mt-3 rounded-2xl bg-slate-50 px-4 py-4">
                <Text className="text-sm text-slate-400">Available courses</Text>
                <Text className="mt-2 text-2xl font-bold text-slate-950">
                  {dashboard?.stats.totalCourses ?? 0}
                </Text>
              </View>
            </View>

            <View className="mt-6">
              <SectionHeader title="My enrolled courses" actionLabel="See all" />
              <View className="mt-4 gap-4">
                {displayedMyCourses.length ? (
                  displayedMyCourses.map((course) => (
                    <CourseCard key={course.id} course={mapEnrollmentToCard(course)} />
                  ))
                ) : (
                  <View className="rounded-[28px] border border-dashed border-slate-300 bg-white px-5 py-6">
                    <Text className="text-center text-base font-semibold text-slate-950">
                      No enrolled courses yet
                    </Text>
                    <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
                      Enroll in a course from the catalog to see your progress here.
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View className="mt-6">
              <SectionHeader
                title="Popular courses"
                actionLabel={isCourseLoading ? 'Refreshing...' : 'Browse'}
              />
              <View className="mt-4 gap-4">
                {courses.length ? (
                  courses.map((course) => (
                    <CourseCard key={course.id} course={mapCourseToCard(course)} variant="light" ctaLabel="View course" />
                  ))
                ) : (
                  <View className="rounded-[28px] border border-dashed border-slate-300 bg-white px-5 py-6">
                    <Text className="text-center text-base font-semibold text-slate-950">
                      No courses matched your filter
                    </Text>
                    <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
                      Try another search term or switch to a different category.
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View className="mt-6 rounded-[30px] bg-emerald-500 px-5 py-5">
              <SectionHeader title="Upcoming live class" actionLabel="Join soon" invert />
              <Text className="mt-4 text-xl font-bold text-white">
                {dashboard?.upcomingLiveClass.title}
              </Text>
              <Text className="mt-2 text-sm leading-6 text-emerald-50">
                {dashboard?.upcomingLiveClass.teacher} •{' '}
                {dashboard?.upcomingLiveClass.startsAt
                  ? new Date(dashboard.upcomingLiveClass.startsAt).toLocaleString()
                  : 'Coming soon'}{' '}
                • {dashboard?.upcomingLiveClass.platform}
              </Text>
              <View className="mt-5 flex-row items-center rounded-2xl bg-white/15 px-4 py-4">
                <Ionicons name="videocam-outline" size={20} color="#ffffff" />
                <Text className="ml-3 text-sm font-medium text-white">
                  Interactive live session synced from your backend dashboard
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <BottomNav />
      </View>
    </SafeAreaView>
  );
}
