import type { ApiSuccessResponse } from '@/types/auth.types';
import type { Course } from '@/types/course.types';

export type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  course: Course;
};

export type MyCoursesResponse = ApiSuccessResponse<Enrollment[]>;
export type EnrollResponse = ApiSuccessResponse<Enrollment>;
export type UpdateProgressRequest = {
  progress: number;
};
