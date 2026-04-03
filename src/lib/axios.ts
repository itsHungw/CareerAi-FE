import axios, { AxiosError } from 'axios';

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorPayload {
  success?: boolean;
  message?: string;
}

export class ApiClientError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
  }
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('careerai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'Request failed';

    if (status === 401 && typeof window !== 'undefined' && window.location.pathname !== '/login') {
      localStorage.removeItem('careerai_token');
      localStorage.removeItem('careerai_user');
      window.location.href = '/login';
    }

    return Promise.reject(new ApiClientError(message, status));
  }
);

export default api;
