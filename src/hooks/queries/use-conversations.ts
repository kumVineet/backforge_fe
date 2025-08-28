import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { conversationEndpoints } from '@/lib/endpoints';

export interface OtherUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  last_seen?: string | 'online';
}

export interface Conversation {
  id: string;
  type: 'private' | 'group';
  title: string | null;
  created_at: string;
  updated_at: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  user_role: string;
  other_user?: OtherUser;
}

export interface ConversationsResponse {
  success: boolean;
  data: Conversation[];
}

export const conversationKeys = {
  all: ['conversations'] as const,
  list: () => [...conversationKeys.all, 'list'] as const,
  detail: (id: string) => [...conversationKeys.all, 'detail', id] as const,
};

export const useConversations = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: conversationKeys.list(),
    queryFn: async (): Promise<ConversationsResponse> => {
      const response = await api.get(conversationEndpoints.list());
      return response;
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 3,
    enabled: options?.enabled ?? true,
  });
};
