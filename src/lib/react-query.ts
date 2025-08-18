import { QueryClient } from "@tanstack/react-query";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Query keys factory for consistent key management
export const queryKeys = {
  // Auth
  auth: {
    user: ["auth", "user"] as const,
    session: ["auth", "session"] as const,
  },

  // Users
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters: string) =>
      [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Generic pattern for other resources
  createResourceKeys: (resource: string) => ({
    all: [resource] as const,
    lists: () => [resource, "list"] as const,
    list: (filters: string) => [resource, "list", { filters }] as const,
    details: () => [resource, "detail"] as const,
    detail: (id: string) => [resource, "detail", id] as const,
  }),
};
