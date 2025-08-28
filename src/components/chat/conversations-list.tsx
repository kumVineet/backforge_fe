'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, MoreHorizontal, User, Users, Search } from "lucide-react";

interface OtherUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  last_seen?: string | 'online';
}

interface Conversation {
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

interface ConversationsListProps {
  conversationsData: { data: Conversation[] } | undefined;
  conversationsLoading: boolean;
  selectedChat: string;
  onSelectChat: (chatId: string) => void;
  onSearchUsers: () => void;
}

export function ConversationsList({
  conversationsData,
  conversationsLoading,
  selectedChat,
  onSelectChat,
  onSearchUsers
}: ConversationsListProps) {
  return (
    <div className="lg:col-span-1">
      <Card className="border-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 border border-cyan-500/20 h-[calc(100vh-12rem)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center justify-between text-lg">
            <span>Chats</span>
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 p-2">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {conversationsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : conversationsData?.data && conversationsData.data.length > 0 ? (
            <div className="space-y-2 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
              {conversationsData.data.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedChat === conversation.id
                      ? 'bg-cyan-500/20 border-cyan-500/30 shadow-lg'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                  onClick={() => onSelectChat(conversation.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      conversation.type === 'private'
                        ? 'bg-gradient-to-r from-purple-400 to-pink-500'
                        : 'bg-gradient-to-r from-cyan-400 to-blue-500'
                    }`}>
                      {conversation.type === 'private' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Users className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate mb-1">
                        {conversation.type === 'private' && conversation.other_user
                          ? conversation.other_user.name
                          : conversation.title || 'Group Chat'
                        }
                      </p>
                      <p className="text-xs text-cyan-300 truncate mb-1">
                        {conversation.last_message}
                      </p>
                      {conversation.unread_count > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {new Date(conversation.last_message_at).toLocaleDateString()}
                          </span>
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                            {conversation.unread_count}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                <MessageCircle className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-sm font-medium text-white mb-2">No conversations yet</h3>
              <p className="text-xs text-gray-400 mb-4">Start chatting by searching for users</p>
              <Button
                variant="outline"
                size="sm"
                onClick={onSearchUsers}
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 text-xs"
              >
                <Search className="w-3 h-3 mr-1" />
                Search Users
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
