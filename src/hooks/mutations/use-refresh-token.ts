import { useMutation } from '@tanstack/react-query';
import { refreshAuthToken } from '@/lib/token-refresh';
import { useAuthStore } from '@/lib/auth-store';

export function useRefreshToken() {
  const { setTokens } = useAuthStore();

  return useMutation({
    mutationFn: refreshAuthToken,
    onSuccess: (data) => {
      if (data) {
        setTokens(data.accessToken, data.refreshToken || '');
      }
    },
    onError: (error) => {
      console.error('Token refresh failed:', error);
      // If refresh fails, the auth store will handle logout
    },
  });
}
