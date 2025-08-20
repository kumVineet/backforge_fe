import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { uploadKeys, UploadFile } from '../queries/use-uploads';

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
        const presignedResponse = await apiClient.post('/api/v1/uploads/presigned-upload-url', {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size
        });

        const { presignedUrl, s3Key } = presignedResponse.data;

        // Step 2: Upload file to S3 using presigned URL
        const uploadResponse = await fetch(presignedUrl, {
          method: 'PUT',
          body: file,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error('S3 upload failed:', {
            status: uploadResponse.status,
            statusText: uploadResponse.statusText,
            response: errorText
          });
          throw new Error(`S3 upload failed: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorText}`);
        }

        // Step 3: Store metadata in our database
        const fileCategory = getFileCategory(file.type);
        console.log('File category detected:', { mimeType: file.type, category: fileCategory });

        const metadataResponse = await apiClient.post('/api/v1/uploads/store-metadata', {
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
        const response = await apiClient.delete(`/api/v1/uploads/file/${fileId}`);

        // Axios automatically throws on non-2xx status codes, so we just return the data
        return response.data;
      } catch (error) {
        console.error('Delete failed:', error);
        throw error;
      }
    },
    onSuccess: (data, fileId) => {
      console.log(data.message); // "File deleted successfully"

      // Optimistically update the cache by removing the deleted file
      queryClient.setQueryData(uploadKeys.myFiles(), (oldData: any) => {
        if (!oldData?.files) return oldData;

        return {
          ...oldData,
          files: oldData.files.filter((file: UploadFile) => file.id !== fileId),
          pagination: {
            ...oldData.pagination,
            total: Math.max(0, oldData.pagination.total - 1)
          }
        };
      });

      // Also invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: uploadKeys.myFiles() });
    },
    onError: (error) => {
      console.error('Delete failed:', error);
    },
  });
};

// Hook for updating file metadata
export const useUpdateFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fileId, updates }: { fileId: string | number; updates: Partial<UploadFile> }): Promise<UploadFile> => {
      const response = await apiClient.put(`/api/v1/uploads/file/${fileId}`, updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: uploadKeys.myFiles() });
    },
  });
};
