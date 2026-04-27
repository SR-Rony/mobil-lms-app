import { create } from 'zustand';

import { authService } from '@/services/auth.service';
import {
  clearStoredAccessToken,
  getApiErrorMessage,
  getStoredAccessToken,
  persistAccessToken,
} from '@/services/api';
import type { AuthUser, LoginRequest, RegisterRequest } from '@/types/auth.types';

type AuthStore = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  loadUser: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isBootstrapping: true,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  initialize: async () => {
    if (!get().isBootstrapping) {
      return;
    }

    try {
      const token = await getStoredAccessToken();

      if (!token) {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isBootstrapping: false,
          error: null,
        });
        return;
      }

      const user = await authService.me();

      set({
        user,
        token,
        isAuthenticated: true,
        isBootstrapping: false,
        error: null,
      });
    } catch (error) {
      await clearStoredAccessToken();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isBootstrapping: false,
        error: getApiErrorMessage(error),
      });
    }
  },

  login: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const authPayload = await authService.login(payload);
      await persistAccessToken(authPayload.token);

      set({
        user: authPayload.user,
        token: authPayload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error),
      });
      throw error;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const authPayload = await authService.register(payload);
      await persistAccessToken(authPayload.token);

      set({
        user: authPayload.user,
        token: authPayload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error),
      });
      throw error;
    }
  },

  loadUser: async () => {
    try {
      const user = await authService.me();
      set({ user, isAuthenticated: true, error: null });
    } catch (error) {
      set({ error: getApiErrorMessage(error) });
      throw error;
    }
  },

  logout: async () => {
    await clearStoredAccessToken();

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
    });
  },
}));
