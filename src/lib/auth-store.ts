import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { refreshAuthToken } from './token-refresh';


export interface User {
  id: string | number;
  email: string;
  name: string;
  mobile_number?: string;
  profileImage?: string;
  role: string;
  refresh_token?: string | null;
  refresh_token_expires_at?: string | null;
  is_active?: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  // Profile fields
  bio?: string;
  date_of_birth?: string;
  gender?: string;
  location?: string;
  website?: string;
  occupation?: string;
  company?: string;
  phone?: string;
  address?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  preferences?: {
    theme: 'light' | 'dark';
    notifications: boolean;
    privacy: 'public' | 'friends' | 'private';
  };
  privacy_settings?: {
    profile_visibility: 'public' | 'friends' | 'private';
    contact_visibility: 'public' | 'friends' | 'private';
    location_visibility: 'public' | 'friends' | 'private';
  };
  education?: {
    degree: string;
    institution: string;
    year: number;
  };
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  updateProfile: (profileData: Partial<User>) => void;
  refreshAuthToken: () => Promise<boolean>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
      },

      clearTokens: () => set({ accessToken: null, refreshToken: null }),

      setLoading: (isLoading) => set({ isLoading }),

      logout: () => set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      }),

      login: (user, accessToken, refreshToken) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      updateProfile: (profileData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...profileData }
          });
        }
      },

      refreshAuthToken: async () => {
        const currentRefreshToken = get().refreshToken;
        if (!currentRefreshToken) {
          return false;
        }

        try {
          set({ isLoading: true });

          const result = await refreshAuthToken(currentRefreshToken);

          if (result) {
            set({
              accessToken: result.accessToken,
              refreshToken: result.refreshToken || currentRefreshToken,
            });
            return true;
          }

          return false;
        } catch (error) {
          console.error('Token refresh failed:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
      }),
    }
  )
);
