'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Users, User } from "lucide-react";
import { useRef, useEffect, useState } from 'react';
import { ChatMessage, Conversation } from '@/contexts';


interface ConversationsListProps {
  selectedChat: string;
  conversationsData: { data: Conversation[] } | undefined;
  messages: ChatMessage[];
  message: string;
  isConnected: boolean;
  isSocketAuthenticated: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onInputFocus: () => void;
  onInputBlur: () => void;
  typingUsers?: string[];
}

export function ChatMessages({
  selectedChat,
  conversationsData,
  messages,
  message,
  isConnected,
  isSocketAuthenticated,
  onMessageChange,
  onSendMessage,
  onKeyPress,
  onInputFocus,
  onInputBlur,
  typingUsers
}: ConversationsListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [prevMessagesLength, setPrevMessagesLength] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Check if user is near bottom of messages
  const isNearBottom = () => {
    if (!messagesContainerRef.current) return true;
    const container = messagesContainerRef.current;
    const threshold = 100; // pixels from bottom
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  };

  // Smart scroll to bottom - only if user is already near bottom
  const scrollToBottom = (force = false) => {
    if (!messagesEndRef.current) return;

    if (force || shouldAutoScroll) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
      setShouldAutoScroll(true);
      setShowScrollButton(false);
    }
  };

  // Handle scroll events to detect user scrolling
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const isNear = isNearBottom();
      setShouldAutoScroll(isNear);
      setShowScrollButton(!isNear);
    }
  };

  // Scroll to bottom on new messages (only if user was near bottom)
  useEffect(() => {
    const hasNewMessages = messages.length > prevMessagesLength;

    if (hasNewMessages) {
      // Only auto-scroll if user was near bottom or it's the first message
      if (shouldAutoScroll || prevMessagesLength === 0) {
        // Use setTimeout to ensure DOM is updated
        setTimeout(() => scrollToBottom(true), 100);
      }
    }

    setPrevMessagesLength(messages.length);
  }, [messages.length, shouldAutoScroll, prevMessagesLength]);

  // Scroll to bottom when conversation changes
  useEffect(() => {
    setShouldAutoScroll(true);
    setTimeout(() => scrollToBottom(true), 100);
  }, [selectedChat]);

  // Add scroll event listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const selectedConversation = conversationsData?.data?.find(conv => conv.id === selectedChat);

  const formatLastSeen = (lastSeen: string) => {
    const lastSeenDate = new Date(lastSeen);
    const today = new Date();
    const isToday = lastSeenDate.toDateString() === today.toDateString();

    if (isToday) {
      return lastSeenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return lastSeenDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
             lastSeenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const getInputPlaceholder = () => {
    if (!selectedConversation) {
      return "Select a conversation to chat";
    }
    if (!isConnected || !isSocketAuthenticated) {
      return "Connecting to chat...";
    }
    if (selectedConversation.type === 'private') {
      return `Message ${selectedConversation.other_user?.name || 'this user'}...`;
    }
    return `Message ${selectedConversation.title || 'group'}...`;
  };

  const isInputDisabled = () => {
    return !selectedConversation || !isConnected || !isSocketAuthenticated;
  };

  const isSendDisabled = () => {
    return !message.trim() || !selectedConversation || !isConnected || !isSocketAuthenticated;
  };

  return (
    <div className="lg:col-span-3">
      <Card className="border-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 border border-cyan-500/20 h-[calc(100vh-12rem)]">
        <CardHeader className="border-b border-white/10 py-3">
          <div className="flex items-center space-x-3">
            {selectedConversation?.type === 'private' ? (
              <>
                <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-r from-purple-400 to-pink-500">
                  {selectedConversation.other_user?.avatar ? (
                    <img
                      src={selectedConversation.other_user.avatar}
                      alt={selectedConversation.other_user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-sm">
                      {selectedConversation.other_user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-semibold capitalize text-base">
                    {selectedConversation.other_user?.name || 'Private Chat'}
                  </span>
                  <span className="text-xs text-gray-300">
                    {selectedConversation.other_user?.last_seen ? (
                      selectedConversation.other_user.last_seen === 'online' ? (
                        <span className="text-green-400 flex items-center">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                          Online
                        </span>
                      ) : (
                        `Last seen ${formatLastSeen(selectedConversation.other_user.last_seen)}`
                      )
                    ) : (
                      'Offline'
                    )}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-cyan-400 to-blue-500">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-semibold capitalize text-base">
                    {selectedConversation?.title || 'Group Chat'}
                  </span>
                  <span className="text-xs text-gray-300">
                    Group chat
                  </span>
                </div>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0 flex flex-col h-full">
          {/* Messages Area - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 relative" ref={messagesContainerRef}>
            {/* Scroll to Bottom Button */}
            {showScrollButton && (
              <button
                onClick={() => scrollToBottom(true)}
                className="absolute bottom-4 right-4 z-10 w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full shadow-lg shadow-cyan-500/25 flex items-center justify-center transition-all duration-200 hover:scale-110"
                title="Scroll to bottom"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            )}

            {!selectedConversation ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                  <MessageCircle className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Select a conversation</h3>
                <p className="text-gray-400">
                  Choose a conversation from the left to start chatting
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
                  <MessageCircle className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  {selectedConversation.type === 'private'
                    ? `Start chatting with ${selectedConversation.other_user?.name || 'this user'}`
                    : `Welcome to ${selectedConversation.title || 'Group Chat'}!`
                  }
                </h3>
                <p className="text-gray-400">
                  {isConnected && isSocketAuthenticated
                    ? 'Start typing to send a message'
                    : 'Connecting to chat server...'
                  }
                </p>
                {selectedConversation.last_message && (
                  <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-gray-400 mb-1">Last message:</p>
                    <p className="text-sm text-white">{selectedConversation.last_message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {selectedConversation.last_message_at && new Date(selectedConversation.last_message_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Messages */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} mb-3`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                      msg.isOwn
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-md'
                        : msg.user_id === 'system'
                          ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30 rounded-bl-md'
                          : 'bg-white/10 text-white border border-white/20 rounded-bl-md'
                    }`}>
                      {msg.user_id !== 'system' && !msg.isOwn && selectedConversation?.type === 'group' && (
                        <p className="text-xs opacity-75 mb-2 font-medium">{msg.username}</p>
                      )}
                      <p className="text-m leading-relaxed">{msg.message}</p>
                      <div className={`flex items-center mt-2 space-x-1 ${
                        msg.isOwn ? 'justify-end' : 'justify-start'
                      }`}>
                        {!msg.isOwn && msg.user_id === 'system' && (
                          <span className="text-[10px] opacity-75">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                        {msg.isOwn && (
                          <>
                            <span className="text-[10px] opacity-75">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <div className="w-3 h-3 ml-1">
                              <svg viewBox="0 0 16 12" fill="currentColor" className="w-full h-full opacity-75">
                                <path d="M6.5 9.5L2 5l1.5-1.5L6.5 7 12.5 1 14 2.5z"/>
                              </svg>
                            </div>
                          </>
                        )}
                        {!msg.isOwn && msg.user_id !== 'system' && (
                          <span className="text-[10px] opacity-75">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Indicator - Above Input */}
          <div className={`border-t border-white/10 transition-all duration-200 ${
            typingUsers && typingUsers.length > 0
              ? 'h-16 opacity-100'
              : 'h-0 opacity-0 overflow-hidden'
          }`}>
            {typingUsers && typingUsers.length > 0 && (
              <div className="px-4 py-3 bg-white/5">
                <div className="flex items-center space-x-3 text-cyan-300">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm font-medium">
                    {typingUsers.length === 1
                      ? `${typingUsers[0]} is typing...`
                      : `${typingUsers.join(', ')} are typing...`
                    }
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Message Input - Fixed to bottom */}
          <div className="border-t border-white/10 py-3 px-4 flex-shrink-0 bg-white/5">
            <div className="flex space-x-3">
              <Input
                placeholder={getInputPlaceholder()}
                value={message}
                onChange={(e) => onMessageChange(e.target.value)}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
                onKeyPress={onKeyPress}
                disabled={isInputDisabled()}
                className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 disabled:opacity-50"
              />
              <Button
                onClick={onSendMessage}
                disabled={isSendDisabled()}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
