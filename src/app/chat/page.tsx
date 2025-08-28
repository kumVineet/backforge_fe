'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { MessageCircle } from "lucide-react";
import { useAuthStatus } from "@/hooks";
import { useUserSearch, useConversations } from "@/hooks/queries";
import { useCreatePrivateConversation } from "@/hooks/mutations";
import { AuthModal } from "@/components/auth";
import { SearchControls, UserSearchResults, ConversationsList, ChatMessages } from "@/components/chat";
import { useChat, ChatMessage } from "@/contexts";
import { useSocketConnection } from "@/contexts";

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'conversations' | 'users'>('conversations');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  // Check authentication status
  const { isAuthenticated } = useAuthStatus();

  // Socket connection status
  const { isConnected, isAuthenticated: isSocketAuthenticated } = useSocketConnection();

  // Chat context for all chat-related functions
  const {
    state: chatState,
    actions: chatActions
  } = useChat();

  const {
    selectedConversation,
    messages: allMessages,
    conversations: chatConversations,
    error: chatError
  } = chatState;

  const {
    selectConversation,
    joinConversation,
    sendMessage,
    startTyping,
    stopTyping,
    setConversations
  } = chatActions;

  // User search hook
  const { data: userSearchData, isLoading: userSearchLoading } = useUserSearch({
    query: userSearchQuery,
    page: 1,
    limit: 5,
    enabled: !!userSearchQuery.trim() && userSearchQuery.trim().length >= 2 && searchType === 'users'
  });

  // Conversations hook
  const { data: conversationsData, isLoading: conversationsLoading } = useConversations({
    enabled: isAuthenticated
  });

  // Create private conversation hook
  const createPrivateConversation = useCreatePrivateConversation();

  // Update chat conversations when API data changes
  useEffect(() => {
    if (conversationsData?.data) {
      setConversations(conversationsData.data);
    }
  }, [conversationsData, setConversations]);

  // Auto-switch to user search if no conversations
  useEffect(() => {
    if (conversationsData?.data && conversationsData.data.length === 0 && !conversationsLoading) {
      setSearchType('users');
    }
  }, [conversationsData, conversationsLoading]);

  // Handle conversation selection
  const handleSelectConversation = (conversationId: string) => {
    // Usage: joinConversation('b9a6f809-bc49-4c9d-bcaa-8e205238bbcf');
    selectConversation(conversationId);
    joinConversation(conversationId);
  };

  // Handle starting a conversation with a user
  const handleStartConversation = async (userId: number, userName: string) => {
    try {
      const result = await createPrivateConversation.mutateAsync({ user_id: userId });
      if (result.success) {
        // Switch to the new conversation
        handleSelectConversation(result.data.id);
        // Switch back to conversations view
        setSearchType('conversations');
        // Clear user search
        setUserSearchQuery('');
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
      // You can add toast notification here if you have a toast system
    }
  };

  // Handle typing indicators based on input focus
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  // Handle input focus - show typing indicator
  const handleInputFocus = () => {
    if (isConnected && isSocketAuthenticated && selectedConversation) {
      console.log('⌨️ Input focused - showing typing indicator');
      startTyping(selectedConversation);
    }
  };

  // Handle input blur - hide typing indicator
  const handleInputBlur = () => {
    if (isConnected && isSocketAuthenticated && selectedConversation) {
      console.log('⌨️ Input blurred - hiding typing indicator');
      stopTyping(selectedConversation);
    }
  };

  // Handle message input change (for the ChatMessages component)
  const handleMessageChange = (message: string) => {
    setMessage(message);
  };

  // Handle sending message using the chat context
  const handleSendMessage = async () => {
    if (!message.trim() || !isConnected || !isSocketAuthenticated || !selectedConversation) return;

    try {
      await sendMessage(selectedConversation, message.trim(), 'text');
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      // You can add toast notification here if you have a toast system
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpenSignIn = () => {
    setAuthMode("signin");
    setAuthModalOpen(true);
  };

  const handleOpenSignUp = () => {
    setAuthMode("signup");
    setAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
  };

  // Get messages for selected conversation
  const getCurrentMessages = () => {
    if (!selectedConversation) return [];
    return allMessages.get(selectedConversation) || [];
  };

  // Custom navigation configuration
  const navigationConfig = {
    backgroundColor: "bg-gradient-to-r from-cyan-900/50 to-blue-900/50",
    logoText: "BF",
    content: (
      <div className="flex items-center justify-center w-full">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold text-white">Chat with friends</h1>
          <p className="text-cyan-200">Connect with users through instant messaging</p>
        </div>
      </div>
    ),
  };

  return (
    <Layout navigation={navigationConfig}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900">

        {/* Authentication Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={handleCloseAuthModal}
          initialMode={authMode}
        />

        {/* Chat Error Display */}
        {chatError && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {chatError}
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Controls */}
          <SearchControls
            searchType={searchType}
            searchQuery={searchQuery}
            userSearchQuery={userSearchQuery}
            onSearchTypeChange={setSearchType}
            onSearchQueryChange={setSearchQuery}
            onUserSearchQueryChange={setUserSearchQuery}
          />

          {/* User Search Results */}
          {searchType === 'users' && (
            <UserSearchResults
              userSearchQuery={userSearchQuery}
              userSearchData={userSearchData}
              userSearchLoading={userSearchLoading}
              createPrivateConversationPending={createPrivateConversation.isPending}
              onStartConversation={handleStartConversation}
            />
          )}

          {/* Authentication Required Message */}
          {!isAuthenticated && (
            <div className="text-center py-16 mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                <MessageCircle className="w-12 h-12 text-red-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Authentication Required</h3>
              <p className="text-gray-400 mb-6">Please log in to access the chat</p>
              <div className="flex space-x-3 justify-center">
                <Button
                  onClick={handleOpenSignIn}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg shadow-red-500/25"
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleOpenSignUp}
                  variant="outline"
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                >
                  Create Account
                </Button>
              </div>
            </div>
          )}

          {/* Chat Interface - Only show when authenticated */}
          {isAuthenticated && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Chat List */}
              <ConversationsList
                conversationsData={conversationsData}
                conversationsLoading={conversationsLoading}
                selectedChat={selectedConversation || ''}
                onSelectChat={handleSelectConversation}
                onSearchUsers={() => setSearchType('users')}
              />

              {/* Chat Messages */}
              <ChatMessages
                selectedChat={selectedConversation || ''}
                conversationsData={conversationsData}
                messages={getCurrentMessages()}
                message={message}
                isConnected={isConnected}
                isSocketAuthenticated={isSocketAuthenticated}
                onMessageChange={handleMessageChange}
                onSendMessage={handleSendMessage}
                onKeyPress={handleKeyPress}
                onInputFocus={handleInputFocus}
                onInputBlur={handleInputBlur}
                typingUsers={chatActions.getTypingUsers(selectedConversation || '')}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
