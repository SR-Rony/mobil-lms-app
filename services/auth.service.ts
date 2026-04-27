import { api } from '@/services/api';
import type {
  ApiSuccessResponse,
  AuthPayload,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from '@/types/auth.types';

export const authService = {
  async login(payload: LoginRequest) {
    const response = await api.post<ApiSuccessResponse<AuthPayload>>('/api/login', payload);
    return response.data.data;
  },

  async register(payload: RegisterRequest) {
    const response = await api.post<ApiSuccessResponse<AuthPayload>>('/api/register', payload);
    return response.data.data;
  },

  async me() {
    const response = await api.get<ApiSuccessResponse<AuthUser>>('/api/me');
    return response.data.data;
  },
};
