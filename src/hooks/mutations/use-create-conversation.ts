import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { conversationKeys } from '@/hooks/queries/use-conversations';
import { conversationEndpoints } from '@/lib/endpoints';

export interface CreatePrivateConversationData {
  user_id: number;
}

export interface CreatePrivateConversationResponse {
  success: boolean;
  data: {
    id: string;
    type: 'private';
    title: null;
    created_at: string;
    updated_at: string;
    last_message: string | null;
    last_message_at: string | null;
    unread_count: number;
    user_role: string;
    other_user: {
      id: number;
      name: string;
      email: string;
    };
  };
  message: string;
}

export const useCreatePrivateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePrivateConversationData): Promise<CreatePrivateConversationResponse> => {
      const response = await api.post(conversationEndpoints.createPrivate(), data);
      return response;
    },
    onSuccess: () => {
      // Invalidate conversations list to refresh the data
      queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
    },
  });
};
