import { config } from './config';
import apiClient from './api-client';

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

export async function refreshAuthToken(refreshToken: string): Promise<TokenRefreshResponse | null> {
  try {
    const response = await apiClient.post('/api/v1/auth/refresh', {
      refreshToken
    });

    if (response.data?.accessToken) {
      return {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken || refreshToken,
      };
    }

    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
}
