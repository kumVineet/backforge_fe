import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import { api } from "@/lib/api-client";

// Generic types for API responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Base hook for GET requests
export function useApiQuery<T>(
  queryKey: readonly unknown[],
  url: string,
  options?: Omit<UseQueryOptions<T, Error, T>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey,
    queryFn: () => api.get<T>(url),
    ...options,
  });
}

// Base hook for POST requests
export function useApiMutation<T, V>(
  url: string,
  options?: Omit<UseMutationOptions<T, Error, V>, "mutationFn">
) {
  const queryClient = useQueryClient();

  // Debug: Log the URL being called
  console.log("useApiMutation called with URL:", url);

  return useMutation({
    mutationFn: (variables: V) => api.post<T>(url, variables),
    ...options,
  });
}

// Base hook for PUT requests
export function useApiUpdate<T, V>(
  url: string,
  options?: Omit<UseMutationOptions<T, Error, V>, "mutationFn">
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: V) => api.put<T>(url, variables),
    ...options,
  });
}

// Base hook for DELETE requests
export function useApiDelete<T>(
  url: string,
  options?: Omit<UseMutationOptions<T, Error, string | number>, "mutationFn">
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => api.delete<T>(`${url}/${id}`),
    ...options,
  });
}

// Hook for optimistic updates
export function useOptimisticUpdate<T>(
  queryKey: readonly unknown[],
  updateFn: (oldData: T | undefined, variables: any) => T
) {
  const queryClient = useQueryClient();

  return (variables: any) => {
    queryClient.setQueryData(queryKey, (oldData: T | undefined) =>
      updateFn(oldData, variables)
    );
  };
}
