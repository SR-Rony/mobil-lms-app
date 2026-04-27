import { api } from '@/services/api';
import type { EnrollResponse, MyCoursesResponse, UpdateProgressRequest } from '@/types/enrollment.types';

export const enrollmentService = {
  async getMyCourses() {
    const response = await api.get<MyCoursesResponse>('/api/my-courses');
    return response.data.data;
  },

  async enroll(courseId: string) {
    const response = await api.post<EnrollResponse>('/api/enroll', { courseId });
    return response.data.data;
  },

  async updateProgress(id: string, payload: UpdateProgressRequest) {
    const response = await api.patch<EnrollResponse>(`/api/progress/${id}`, payload);
    return response.data.data;
  },
};
