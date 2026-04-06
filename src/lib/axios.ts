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

interface QueuedRequest {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

// In-memory token storage
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  withCredentials: true, // Send cookies with every request
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorPayload>) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'Request failed';

    const isAuthEndpoint = !!originalRequest?.url?.includes('/auth/');

    // If 401 and not a refresh request itself and not a public auth endpoint
    if (status === 401 && originalRequest && !originalRequest.url?.includes('/auth/refresh') && !isAuthEndpoint) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Backend reads refreshToken from HttpOnly cookie automatically
        const { data } = await axios.post<ApiEnvelope<string>>(`${api.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true });
        const newAccessToken = data.data;

        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);
        isRefreshing = false;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Global logout if refresh fails
        setAccessToken(null);
        if (typeof window !== 'undefined') {
           localStorage.removeItem('careerai_user'); // Still keep user profile in LS or remove it?
           window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(new ApiClientError(message, status));
  }
);

export default api;
