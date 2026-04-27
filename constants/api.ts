import { API_BASE_URL as baseUrl } from '@/services/api';

export const API_BASE_URL = baseUrl;

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
