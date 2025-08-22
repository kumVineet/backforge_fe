import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

// Types for upload data - matching the new API response structure
export interface UploadFile {
  id: string | number;
  user_id: number;
  original_name: string;
  filename: string;
  file_path: string | null;
  file_size: string;
  mime_type: string;
  category: string;
  title: string | null;
  description: string | null;
  tags: string[] | null;
  is_public: boolean;
  storage_type: string;
  cloud_key: string;
  created_at: string;
  updated_at: string;
  url?: string;
  download_url?: string;
  presignedUrl?: string;
}

// API response structure - matching the new nested structure
export interface MyFilesResponse {
  success: boolean;
  data: {
    files: UploadFile[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalFiles: string;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
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
      const response = await api.get('/api/v1/uploads/my-files');
      return response;
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
      const response = await api.get(`/api/v1/uploads/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
