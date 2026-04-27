import type { ApiSuccessResponse } from '@/types/auth.types';
import type { CourseCategory } from '@/types/course.types';
import type { Enrollment } from '@/types/enrollment.types';

export type DashboardStats = {
  enrolledCourses: number;
  totalCourses: number;
  averageProgress: number;
};

export type UpcomingLiveClass = {
  title: string;
  startsAt: string;
  teacher: string;
  platform: string;
};

export type DashboardData = {
  stats: DashboardStats;
  categories: CourseCategory[];
  continueLearning: Enrollment | null;
  myCourses: Enrollment[];
  upcomingLiveClass: UpcomingLiveClass;
};

export type DashboardResponse = ApiSuccessResponse<DashboardData>;
