import { api } from '@/services/api';
import type { DashboardResponse } from '@/types/dashboard.types';

export const dashboardService = {
  async getDashboard() {
    const response = await api.get<DashboardResponse>('/api/dashboard');
    return response.data.data;
  },
};
