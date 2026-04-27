import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { CourseCard } from '@/components/CourseCard';
import { CustomButton } from '@/components/CustomButton';
import { SectionHeader } from '@/components/SectionHeader';
import { courseService } from '@/services/course.service';
import { enrollmentService } from '@/services/enrollment.service';
import { getApiErrorMessage } from '@/services/api';
import type { Course, CourseCardData } from '@/types/course.types';
import type { Enrollment } from '@/types/enrollment.types';

function mapEnrollmentToCard(enrollment: Enrollment): CourseCardData {
  return {
    id: enrollment.id,
    title: enrollment.course.title,
    instructor: `${enrollment.course.level} • ${enrollment.course.duration}`,
    category: enrollment.course.category.name,
    progress: enrollment.progress,
    lessonsLeft: enrollment.course.lessons.length,
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

export default function CoursesScreen() {
  const [myCourses, setMyCourses] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadCoursesPage() {
    setIsLoading(true);
    setError(null);

    try {
      const [myCoursesData, coursesData] = await Promise.all([
        enrollmentService.getMyCourses(),
        courseService.getCourses(),
      ]);
      setMyCourses(myCoursesData);
      setCourses(coursesData);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCoursesPage();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="bg-ink-950 px-5 pb-8 pt-3">
            <AppHeader
              greeting="Course Library"
              name="Your Courses"
              subtitle="Continue enrolled classes and explore more skill tracks."
            />
          </View>

          <View className="-mt-5 rounded-t-[32px] bg-slate-50 px-5 pb-32 pt-6">
            {error ? (
              <View className="rounded-[28px] bg-white px-5 py-6 shadow-soft">
                <Text className="text-center text-base font-semibold text-slate-950">
                  Couldn&apos;t load courses
                </Text>
                <Text className="mt-2 text-center text-sm leading-6 text-slate-500">{error}</Text>
                <CustomButton title="Retry" className="mt-5" onPress={loadCoursesPage} />
              </View>
            ) : null}

            <SectionHeader
              title="Enrolled courses"
              actionLabel={isLoading ? 'Loading...' : `${myCourses.length} active`}
            />
            <View className="mt-4 gap-4">
              {myCourses.map((course) => (
                <CourseCard key={course.id} course={mapEnrollmentToCard(course)} />
              ))}
            </View>

            <View className="mt-6">
              <SectionHeader title="Popular courses" actionLabel="For you" />
              <View className="mt-4 gap-4">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={mapCourseToCard(course)} variant="light" ctaLabel="View course" />
                ))}
              </View>
            </View>

            <View className="mt-6 rounded-[30px] border border-slate-200 bg-white px-5 py-5 shadow-soft">
              <Text className="text-lg font-semibold text-slate-950">Today&apos;s study target</Text>
              <Text className="mt-2 text-sm leading-6 text-slate-500">
                Finish one module, attend one live session, and revise your previous assignment.
              </Text>
            </View>
          </View>
        </ScrollView>

        <BottomNav />
      </View>
    </SafeAreaView>
  );
}
