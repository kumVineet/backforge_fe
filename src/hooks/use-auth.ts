import { useApiQuery, useApiMutation, useApiUpdate } from "./use-api";
import { queryKeys } from "@/lib/react-query";
import { config } from "@/lib/config";
import { authEndpoints } from "@/lib/endpoints";

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  mobile_number?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  mobile_number: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
}

// Auth hooks
export function useUser() {
  return useApiQuery<User>(queryKeys.auth.user, authEndpoints.me(), {
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

export function useLogin() {
  return useApiMutation<AuthResponse, LoginCredentials>(authEndpoints.login(), {
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem(config.auth.tokenKey, data.accessToken);
      localStorage.setItem(config.auth.refreshTokenKey, data.refreshToken);
      // Invalidate and refetch user data
      // Note: You'll need to access queryClient here or handle this differently
    },
  });
}

export function useRegister() {
  return useApiMutation<AuthResponse, RegisterCredentials>(
    authEndpoints.register(),
    {
      onSuccess: (data) => {
        // Store tokens
        localStorage.setItem(config.auth.tokenKey, data.accessToken);
        localStorage.setItem(config.auth.refreshTokenKey, data.refreshToken);
      },
    }
  );
}

export function useUpdateProfile() {
  return useApiUpdate<User, UpdateProfileData>(authEndpoints.profile(), {
    onSuccess: () => {
      // Invalidate user data to refetch
      // Note: You'll need to access queryClient here or handle this differently
    },
  });
}

export function useLogout() {
  const logout = () => {
    localStorage.removeItem(config.auth.tokenKey);
    localStorage.removeItem(config.auth.refreshTokenKey);
    // Redirect to login or home
    window.location.href = "/";
  };

  return { logout };
}

export function useRefreshToken() {
  return useApiMutation<{ accessToken: string }, void>(
    authEndpoints.refresh(),
    {
      onSuccess: (data) => {
        // Update access token
        localStorage.setItem(config.auth.tokenKey, data.accessToken);
      },
    }
  );
}
