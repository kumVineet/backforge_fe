import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { userEndpoints } from '@/lib/endpoints';

export interface User {
  id: string | number;
  name: string;
  email: string;
  mobile_number?: string;
  password?: string;
  role: string;
  refresh_token?: string | null;
  refresh_token_expires_at?: string | null;
  is_active?: boolean;
  last_login?: string | null;
  created_at: string;
  updated_at: string;
  avatar?: string;
}

export interface UserSearchResponse {
  data: User[];
  success: boolean;
}

export interface UserSearchParams {
  query: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export const userSearchKeys = {
  all: ['users', 'search'] as const,
  query: (params: UserSearchParams) => [...userSearchKeys.all, 'query', params] as const,
};

export const useUserSearch = (params: UserSearchParams) => {
  const { query, page = 1, limit = 10, enabled = true } = params;

  return useQuery({
    queryKey: userSearchKeys.query({ query, page, limit }),
    queryFn: async (): Promise<UserSearchResponse> => {
      if (!query.trim()) {
        throw new Error('Search query is required');
      }

      const response = await api.get(userEndpoints.search(query, page, limit));
      return response;
    },
    enabled: enabled && !!query.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    placeholderData: (previousData) => previousData,
  });
};

// Hook for searching users with debounced input
export const useUserSearchDebounced = (params: UserSearchParams & { debounceMs?: number }) => {
  const { debounceMs = 500, ...searchParams } = params;

  // This hook can be extended with debouncing logic if needed
  // For now, it's the same as useUserSearch but can be enhanced later
  return useUserSearch(searchParams);
};
