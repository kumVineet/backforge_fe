'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Search, User, Mail } from "lucide-react";

interface User {
  id: string | number;
  name: string;
  email: string;
  mobile_number?: string;
  role: string;
  profile_image?: string;
  avatar?: string;
}

interface UserSearchResultsProps {
  userSearchQuery: string;
  userSearchData: { data: User[] } | undefined;
  userSearchLoading: boolean;
  createPrivateConversationPending: boolean;
  onStartConversation: (userId: number, userName: string) => void;
}

export function UserSearchResults({
  userSearchQuery,
  userSearchData,
  userSearchLoading,
  createPrivateConversationPending,
  onStartConversation
}: UserSearchResultsProps) {
  if (!userSearchQuery.trim()) return null;

  return (
    <div className="mb-6">
      <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl shadow-2xl shadow-purple-500/10 border border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>User Search Results</span>
            {userSearchLoading && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-purple-300">Searching...</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userSearchQuery.trim().length < 2 ? (
            <div className="text-center py-8 text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-2 text-gray-600" />
              <p>Please enter at least 2 characters to search users</p>
            </div>
          ) : userSearchData?.data && userSearchData.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userSearchData.data.map((user) => (
                <div
                  key={user.id}
                  className="p-4 rounded-lg border border-purple-500/30 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center overflow-hidden">
                      {user.profile_image || user.avatar ? (
                        <img
                          src={user.profile_image || user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">{user.name}</h4>
                      <div className="flex items-center space-x-1 text-xs text-purple-300">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.mobile_number && (
                        <div className="flex items-center space-x-1 text-xs text-purple-300">
                          <span className="truncate">📱 {user.mobile_number}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1 text-xs text-purple-300">
                        <span className="truncate">Role: {user.role}</span>
                      </div>
                    </div>

                    {/* Chat Button */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartConversation(user.id as number, user.name);
                      }}
                      disabled={createPrivateConversationPending}
                      size="sm"
                      variant="ghost"
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 p-2 h-8 w-8"
                    >
                      {createPrivateConversationPending ? (
                        <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <MessageCircle className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : userSearchQuery.trim() && !userSearchLoading ? (
            <div className="text-center py-8 text-gray-400">
              <User className="w-12 h-12 mx-auto mb-2 text-gray-600" />
              <p>No users found matching "{userSearchQuery}"</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
