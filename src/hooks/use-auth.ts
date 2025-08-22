import { useAuthStore, User } from "@/lib/auth-store";
import { authEndpoints } from "@/lib/endpoints";
import { api } from "@/lib/api-client";

// Types
export interface LoginCredentials {
  identifier: string; // Can be email or mobile number
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
  const { user, isAuthenticated } = useAuthStore();
  return { data: user, isLoading: false, isAuthenticated };
}

export function useLogin() {
  const { login, setLoading } = useAuthStore();

  const handleLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const response = await api.post(authEndpoints.login(), credentials);

      // Since api.post automatically extracts response.data, response is already the data
      const data = response;

      // Check if the response has the expected structure
      if (!data || !data.data) {
        throw new Error('Invalid response structure from server');
      }

      // Extract user and tokens from the nested structure
      const user = data.data.user;
      const accessToken = data.data.tokens?.accessToken;
      const refreshToken = data.data.tokens?.refreshToken;

      if (!user) {
        throw new Error('No user data received from server');
      }

      if (!accessToken || !refreshToken) {
        throw new Error('No tokens received from server');
      }

      // Call the login function from the store
      login(user, accessToken, refreshToken);
      setLoading(false);

      return {
        user,
        accessToken,
        refreshToken
      };
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return { mutate: handleLogin, isLoading: false };
}

export function useRegister() {
  const { login, setLoading } = useAuthStore();

  const handleRegister = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const response = await api.post(authEndpoints.register(), credentials);

      // Since api.post automatically extracts response.data, response is already the data
      const data = response;

      // Check if the response has the expected structure
      if (!data || !data.data) {
        throw new Error('Invalid response structure from server');
      }

      // Extract user and tokens from the nested structure
      const user = data.data.user;
      const accessToken = data.data.tokens?.accessToken;
      const refreshToken = data.data.tokens?.refreshToken;

      if (!user) {
        throw new Error('No user data received from server');
      }

      if (!accessToken || !refreshToken) {
        throw new Error('No tokens received from server');
      }

      // Call the login function from the store
      login(user, accessToken, refreshToken);
      setLoading(false);

      return {
        user,
        accessToken,
        refreshToken
      };
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return { mutate: handleRegister, isLoading: false };
}

export function useUpdateProfile() {
  const { setUser } = useAuthStore();

  const handleUpdateProfile = async (profileData: UpdateProfileData): Promise<User> => {
    const response = await api.patch(authEndpoints.profile(), profileData);
    // Since api.patch automatically extracts response.data, response is already the data
    const data = response;
    setUser(data);
    return data;
  };

  return { mutate: handleUpdateProfile, isLoading: false };
}

export function useLogout() {
  const { logout, refreshToken } = useAuthStore();

  const handleLogout = async () => {
    try {
      // Call the logout API with refresh token
      if (refreshToken) {
        await api.post(authEndpoints.logout(), {
          refreshToken: refreshToken
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Always clear local state
      logout();
      // Redirect to home
      window.location.href = "/";
    }
  };

  return { logout: handleLogout };
}

export function useRefreshToken() {
  const { setTokens, refreshToken } = useAuthStore();

  const handleRefreshToken = async (): Promise<{ accessToken: string }> => {
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post(authEndpoints.refresh(), {
      refreshToken: refreshToken
    });
    // Since api.post automatically extracts response.data, response is already the data
    const data = response;

    // Update tokens in store
    setTokens(data.accessToken, data.refreshToken || refreshToken);
    return data;
  };

  return { mutate: handleRefreshToken, isLoading: false };
}
