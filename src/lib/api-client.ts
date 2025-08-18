import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { config } from "./config";
import { authEndpoints } from "./endpoints";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Debug: Log the base URL being used
console.log("API Client initialized with base URL:", config.api.baseUrl);

// Request interceptor
apiClient.interceptors.request.use(
  (axiosConfig) => {
    // Add auth token if available
    const token = localStorage.getItem(config.auth.tokenKey);
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

    // Handle common errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem(config.auth.refreshTokenKey);
        if (refreshToken) {
          const response = await axios.post(authEndpoints.refresh(), {
            refreshToken,
          });

          if (response.data.accessToken) {
            localStorage.setItem(
              config.auth.tokenKey,
              response.data.accessToken
            );
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect
        localStorage.removeItem(config.auth.tokenKey);
        localStorage.removeItem(config.auth.refreshTokenKey);
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 500) {
      console.error("Server error:", error.response.data);
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
