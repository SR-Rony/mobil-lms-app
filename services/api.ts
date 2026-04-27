import * as SecureStore from 'expo-secure-store';
import axios, { AxiosError } from 'axios';
import { Platform } from 'react-native';

const fallbackBaseUrl =
  Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

const rawApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || fallbackBaseUrl;

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, '');
export const TOKEN_STORAGE_KEY = 'lms-auth-token';

let accessToken: string | null = null;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export async function persistAccessToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_STORAGE_KEY, token);
  setAccessToken(token);
}

export async function getStoredAccessToken() {
  const token = await SecureStore.getItemAsync(TOKEN_STORAGE_KEY);
  setAccessToken(token);
  return token;
}

export async function clearStoredAccessToken() {
  await SecureStore.deleteItemAsync(TOKEN_STORAGE_KEY);
  setAccessToken(null);
}

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || axiosError.message || 'Request failed';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
}
