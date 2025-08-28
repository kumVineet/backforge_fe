import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { config } from "./config";
import { authEndpoints } from "./endpoints";
import { useAuthStore } from "./auth-store";

// Helper function to get token from localStorage (where Zustand persists)
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    try {
      const authData = window.localStorage.getItem('auth-storage');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.state?.accessToken || null;
      }
    } catch (error) {
      // Silent error handling for auth data parsing
    }
  }
  return null;
};

// Helper function to get refresh token from localStorage (where Zustand persists)
const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    try {
      const authData = window.localStorage.getItem('auth-storage');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.state?.refreshToken || null;
      }
    } catch (error) {
      // Silent error handling for auth data parsing
    }
  }
  return null;
};

// Helper function to update tokens in Zustand store
const updateTokensInStore = (accessToken: string, refreshToken?: string): void => {
  if (typeof window !== 'undefined') {
    try {
      // Import and use the auth store directly
      const { useAuthStore } = require('@/lib/auth-store');
      const authStore = useAuthStore.getState();

      if (refreshToken) {
        authStore.setTokens(accessToken, refreshToken);
      } else {
        // If no new refresh token, keep the existing one
        const currentRefreshToken = getRefreshToken();
        authStore.setTokens(accessToken, currentRefreshToken || '');
      }
    } catch (error) {
      console.error('Failed to update tokens in store:', error);
    }
  }
};

// Helper function to clear auth data from localStorage
const clearAuthData = (): void => {
  if (typeof window !== 'undefined') {
    try {
      // Import and use the auth store directly
      const { useAuthStore } = require('@/lib/auth-store');
      const authStore = useAuthStore.getState();
      authStore.logout();
    } catch (error) {
      console.error('Failed to clear auth data:', error);
      // Fallback to manual localStorage clearing
      window.localStorage.removeItem('auth-storage');
    }
  }
};

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (axiosConfig) => {
    // Add auth token if available from localStorage
    const token = getAuthToken();
    if (token) {
      axiosConfig.headers.Authorization = `Bearer ${token}`;
    }
    return axiosConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration (401 with specific error message)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if it's specifically a token expiration error
      const isTokenExpired = error.response?.data?.code === 'TOKEN_EXPIRED' ||
                            error.response?.data?.message?.includes('expired') ||
                            error.response?.data?.message?.includes('Access token has expired');

      if (isTokenExpired) {
        originalRequest._retry = true;

        try {
          // Use the auth store's refreshAuthToken method
          const authStore = useAuthStore.getState();
          const refreshSuccess = await authStore.refreshAuthToken();

          if (refreshSuccess) {
            // Get the new token from the store
            const newToken = useAuthStore.getState().accessToken;
            if (newToken) {
              // Update the request headers and retry
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return apiClient(originalRequest);
            }
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }

      // If refresh failed or no refresh token, clear auth data and redirect to login
      const authStore = useAuthStore.getState();
      authStore.logout();

      // Redirect to home page (which should show login)
      if (typeof window !== 'undefined') {
        window.location.href = "/";
      }

      return Promise.reject(error);
    }

    if (error.response?.status === 500) {
      // Server error occurred
    }

    return Promise.reject(error);
  }
);

// API methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((res) => res.data),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then((res) => res.data),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};

export default apiClient;
