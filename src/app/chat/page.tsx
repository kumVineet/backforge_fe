'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/layout";
import { MessageCircle, Send, Users, Search, Plus, MoreHorizontal, Wifi, WifiOff, AlertCircle } from "lucide-react";
import { useSocket } from "@/hooks";
import { useAuthStatus } from "@/hooks";
import { AuthModal } from "@/components/auth";

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  isOwn: boolean;
}

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedChat, setSelectedChat] = useState('general');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check authentication status
  const { isAuthenticated } = useAuthStatus();

  // Socket hook
  const {
    isConnected,
    isAuthenticated: isSocketAuthenticated,
    isConnecting,
    reconnectAttempts,
    emit,
    on,
    off
  } = useSocket();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSendMessage = () => {
    if (!message.trim() || !isConnected || !isSocketAuthenticated) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current-user', // This should come from auth store
      username: 'You', // This should come from auth store
      message: message.trim(),
      timestamp: new Date(),
      isOwn: true
    };

    // Add message to local state
    setMessages(prev => [...prev, newMessage]);

    // Emit message to socket
    emit('send_message', {
      room: selectedChat,
      message: message.trim(),
      timestamp: new Date().toISOString()
    });

    setMessage('');
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 w-64"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Users className="w-4 h-4 mr-2" />
                Online Users
              </Button>
            </div>
          </div>

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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Chat List */}
              <div className="lg:col-span-1">
                <Card className="border-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 border border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>Conversations</span>
                      <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedChat === 'general'
                            ? 'bg-cyan-500/20 border-cyan-500/30'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        onClick={() => setSelectedChat('general')}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">General Chat</p>
                            <p className="text-xs text-cyan-300">5 members online</p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedChat === 'support'
                            ? 'bg-cyan-500/20 border-cyan-500/30'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        onClick={() => setSelectedChat('support')}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Support Team</p>
                            <p className="text-xs text-blue-300">2 members online</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chat Messages */}
              <div className="lg:col-span-3">
                <Card className="border-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 border border-cyan-500/20 h-96">
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="text-white capitalize">{selectedChat} Chat</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-64 overflow-y-auto p-4 space-y-4">
                      {messages.length === 0 ? (
                        /* Welcome Message */
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
                            <MessageCircle className="w-8 h-8 text-cyan-400" />
                          </div>
                          <h3 className="text-lg font-medium text-white mb-2">Welcome to {selectedChat} Chat!</h3>
                          <p className="text-gray-400">
                            {isConnected && isSocketAuthenticated
                              ? 'Start typing to send a message'
                              : 'Connecting to chat server...'
                            }
                          </p>
                        </div>
                      ) : (
                        /* Messages */
                        messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              msg.isOwn
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                                : msg.userId === 'system'
                                  ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                                  : 'bg-white/10 text-white border border-white/20'
                            }`}>
                              {msg.userId !== 'system' && (
                                <p className="text-xs opacity-75 mb-1">{msg.username}</p>
                              )}
                              <p className="text-sm">{msg.message}</p>
                              <p className="text-xs opacity-75 mt-1 text-right">
                                {msg.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-white/10 p-4">
                      <div className="flex space-x-3">
                        <Input
                          placeholder={
                            isConnected && isSocketAuthenticated
                              ? "Type your message..."
                              : "Connecting to chat..."
                          }
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          disabled={!isConnected || !isSocketAuthenticated}
                          className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 disabled:opacity-50"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!message.trim() || !isConnected || !isSocketAuthenticated}
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
