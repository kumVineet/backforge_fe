import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import apiClient from '@/lib/api-client';
import { uploadKeys, UploadFile } from '@/hooks/queries/use-uploads';

// Function to determine file category based on MIME type
const getFileCategory = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) {
    return 'image';
  } else if (mimeType.startsWith('video/')) {
    return 'video';
  } else if (mimeType.startsWith('audio/')) {
    return 'audio';
  } else if (mimeType === 'application/pdf' ||
             mimeType.startsWith('text/') ||
             mimeType.includes('document') ||
             mimeType.includes('word') ||
             mimeType.includes('excel') ||
             mimeType.includes('powerpoint')) {
    return 'document';
  } else {
    return 'document'; // Default fallback
  }
};

// Hook for uploading files using S3 presigned upload
export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<UploadFile> => {
      try {
        // Step 1: Get presigned upload URL
        const presignedResponse = await api.post('/api/v1/uploads/presigned-upload-url', {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size
        });

        const { presignedUrl, s3Key } = presignedResponse.data;

        // Step 2: Upload file to S3 using presigned URL
        const uploadResponse = await apiClient.put(presignedUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
        });

        if (uploadResponse.status !== 200) {
          console.error('S3 upload failed:', {
            status: uploadResponse.status,
            statusText: uploadResponse.statusText,
            response: uploadResponse.data
          });
          throw new Error(`S3 upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
        }

        // Step 3: Store metadata in our database
        const fileCategory = getFileCategory(file.type);
        console.log('File category detected:', { mimeType: file.type, category: fileCategory });

        const metadataResponse = await api.post('/api/v1/uploads/store-metadata', {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          s3Key: s3Key,
          originalName: file.name,
          mimeType: file.type,
          category: fileCategory
        });

        return metadataResponse.data;

      } catch (error) {
        console.error('Upload process failed:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch user files
      queryClient.invalidateQueries({ queryKey: uploadKeys.myFiles() });
    },
    onError: (error) => {
      console.error('Upload failed:', error);
    },
  });
};

// Hook for deleting files
export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileId: string | number): Promise<{ message: string }> => {
      try {
        const response = await api.delete(`/api/v1/uploads/files/${fileId}`);

        return response;
      } catch (error) {
        console.error('Delete failed 1:', error);
        throw error;
      }
    },
    onSuccess: (data, fileId) => {
      console.log(data.message);
      // Also invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: uploadKeys.myFiles() });
    },
    onError: (error) => {
      console.error('Delete failed 2:', error);
    },
  });
};

// Hook for updating file metadata
export const useUpdateFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fileId, updates }: { fileId: string | number; updates: Partial<UploadFile> }): Promise<UploadFile> => {
      const response = await api.put(`/api/v1/uploads/file/${fileId}`, updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: uploadKeys.myFiles() });
    },
  });
};
