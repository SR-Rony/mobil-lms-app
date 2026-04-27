import { api } from '@/services/api';
import type { ApiSuccessResponse } from '@/types/auth.types';
import type { Course, CourseCategory, CourseQuery } from '@/types/course.types';

export const courseService = {
  async getCategories() {
    const response = await api.get<ApiSuccessResponse<CourseCategory[]>>('/api/categories');
    return response.data.data;
  },

  async getCourses(query: CourseQuery = {}) {
    const response = await api.get<ApiSuccessResponse<Course[]>>('/api/courses', {
      params: {
        search: query.search || '',
        category: query.category || '',
      },
    });

    return response.data.data;
  },

  async getCourseBySlug(slug: string) {
    const response = await api.get<ApiSuccessResponse<Course>>(`/api/courses/${slug}`);
    return response.data.data;
  },
};
