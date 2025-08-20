import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

// Types for upload data
export interface UploadFile {
  id: string | number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: string | number;
  category: string;
  title: string | null;
  description: string | null;
  tags: string[];
  isPublic: boolean;
  storageType: string;
  cloudUrl: string | null;
  s3Key: string;
  downloadUrl: string;
  createdAt: string;
  updatedAt: string;
  url: string;
}

// API response structure
export interface MyFilesResponse {
  files: UploadFile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Query keys
export const uploadKeys = {
  all: ['uploads'] as const,
  myFiles: () => [...uploadKeys.all, 'my-files'] as const,
  file: (id: string | number) => [...uploadKeys.all, 'file', id] as const,
};

// Hook to fetch user's uploaded files
export const useMyFiles = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: uploadKeys.myFiles(),
    queryFn: async (): Promise<MyFilesResponse> => {
      const response = await apiClient.get('/api/v1/uploads/my-files');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    enabled: options?.enabled ?? true,
  });
};

// Hook to fetch a specific file by ID
export const useFile = (id: string | number) => {
  return useQuery({
    queryKey: uploadKeys.file(id),
    queryFn: async (): Promise<UploadFile> => {
      const response = await apiClient.get(`/api/v1/uploads/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
