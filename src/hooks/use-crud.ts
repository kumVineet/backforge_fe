import {
  useApiQuery,
  useApiMutation,
  useApiUpdate,
  useApiDelete,
  PaginatedResponse,
} from "./use-api";
import { queryKeys } from "@/lib/react-query";
import { userEndpoints, createResourceEndpoints } from "@/lib/endpoints";

// Generic CRUD hooks for any resource
export function useResourceList<T>(
  resource: string,
  filters?: Record<string, any>,
  options?: {
    page?: number;
    limit?: number;
    staleTime?: number;
  }
) {
  const queryKey = queryKeys
    .createResourceKeys(resource)
    .list(JSON.stringify(filters || {}));

  const url = `/${resource}?${new URLSearchParams({
    page: (options?.page || 1).toString(),
    limit: (options?.limit || 10).toString(),
    ...filters,
  })}`;

  return useApiQuery<PaginatedResponse<T>>(queryKey, url, {
    staleTime: options?.staleTime || 5 * 60 * 1000,
  });
}

export function useResourceDetail<T>(
  resource: string,
  id: string | number,
  options?: {
    staleTime?: number;
  }
) {
  const queryKey = queryKeys.createResourceKeys(resource).detail(String(id));

  return useApiQuery<T>(queryKey, `/${resource}/${id}`, {
    staleTime: options?.staleTime || 5 * 60 * 1000,
  });
}

export function useCreateResource<T, V>(
  resource: string,
  options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }
) {
  return useApiMutation<T, V>(`/${resource}`, {
    onSuccess: () => {
      // Invalidate list queries
      // Note: You'll need to access queryClient here or handle this differently
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

export function useUpdateResource<T, V>(
  resource: string,
  options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }
) {
  return useApiUpdate<T, V>(`/${resource}`, {
    onSuccess: () => {
      // Invalidate detail and list queries
      // Note: You'll need to access queryClient here or handle this differently
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

export function useDeleteResource<T>(
  resource: string,
  options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }
) {
  return useApiDelete<T>(`/${resource}`, {
    onSuccess: () => {
      // Invalidate list queries
      // Note: You'll need to access queryClient here or handle this differently
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

// Example usage for specific resources using the new endpoints system
export function useUsers(filters?: Record<string, any>) {
  return useApiQuery<PaginatedResponse<any>>(
    queryKeys.createResourceKeys("users").list(JSON.stringify(filters || {})),
    userEndpoints.list(filters),
    {
      staleTime: 5 * 60 * 1000,
    }
  );
}

export function useUser(id: string | number) {
  return useApiQuery<any>(
    queryKeys.createResourceKeys("users").detail(String(id)),
    userEndpoints.detail(String(id)),
    {
      staleTime: 5 * 60 * 1000,
    }
  );
}

export function useCreateUser() {
  return useApiMutation<any, any>(userEndpoints.create(), {
    onSuccess: () => {
      // Invalidate list queries
      // Note: You'll need to access queryClient here or handle this differently
    },
  });
}

export function useUpdateUser() {
  return useApiUpdate<any, any>(
    userEndpoints.update(""), // This will need the ID when called
    {
      onSuccess: () => {
        // Invalidate detail and list queries
        // Note: You'll need the ID when called
      },
    }
  );
}

export function useDeleteUser() {
  return useApiDelete<any>(
    userEndpoints.delete(""), // This will need the ID when called
    {
      onSuccess: () => {
        // Invalidate list queries
        // Note: You'll need to access queryClient here or handle this differently
      },
    }
  );
}
