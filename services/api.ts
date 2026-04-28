import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import axios, { AxiosError } from 'axios';
import { Platform } from 'react-native';

function getExpoHostBaseUrl() {
  const hostUri = Constants.expoConfig?.hostUri ?? Constants.manifest2?.extra?.expoGo?.debuggerHost;

  if (!hostUri) {
    return null;
  }

  const host = hostUri.split(':')[0];

  if (!host) {
    return null;
  }

  return `http://${host}:5000`;
}

function getFallbackBaseUrl() {
  const expoHostBaseUrl = getExpoHostBaseUrl();

  if (expoHostBaseUrl) {
    return expoHostBaseUrl;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  }

  return 'http://localhost:5000';
}

function shouldReplaceWithExpoHost(apiBaseUrl: string) {
  const normalizedUrl = apiBaseUrl.trim().toLowerCase();

  return normalizedUrl === 'http://10.0.2.2:5000' || normalizedUrl === 'http://localhost:5000';
}

function resolveApiBaseUrl() {
  const envApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  const expoHostBaseUrl = getExpoHostBaseUrl();

  if (envApiBaseUrl) {
    if (expoHostBaseUrl && shouldReplaceWithExpoHost(envApiBaseUrl)) {
      return expoHostBaseUrl;
    }

    return envApiBaseUrl;
  }

  return getFallbackBaseUrl();
}

const rawApiBaseUrl = resolveApiBaseUrl();

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

    if (axiosError.message === 'Network Error') {
      return `Network error. App could not reach ${API_BASE_URL}. If you are using a real phone, set EXPO_PUBLIC_API_BASE_URL to your computer's local IP.`;
    }

    return axiosError.response?.data?.message || axiosError.message || 'Request failed';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
}
