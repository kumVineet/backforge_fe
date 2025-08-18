'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/layout";
import { MessageCircle, Send, Users, Search, Plus, MoreHorizontal } from "lucide-react";

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Custom navigation configuration
  const navigationConfig = {
    backgroundColor: "bg-gradient-to-r from-cyan-900/50 to-blue-900/50",
    logoText: "BF",
    content: (
      <div className="flex items-center justify-between w-full">
        <div className="flex-1"></div>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold text-white">Real-time Chat</h1>
          <p className="text-cyan-200">Connect with users through instant messaging</p>
        </div>
        <div className="flex-1 flex justify-end">
          <Button
            onClick={() => console.log('New chat')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25 px-8 py-3 text-lg"
          >
            <Plus className="w-6 h-6 mr-2" />
            New Chat
          </Button>
        </div>
      </div>
    ),
  };

  return (
    <Layout navigation={navigationConfig}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900">

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

          {/* Chat Interface */}
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
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
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

                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
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
                  <CardTitle className="text-white">General Chat</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-64 overflow-y-auto p-4 space-y-4">
                    {/* Welcome Message */}
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
                        <MessageCircle className="w-8 h-8 text-cyan-400" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">Welcome to Chat!</h3>
                      <p className="text-gray-400">
                        Start a conversation or join an existing chat room
                      </p>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-white/10 p-4">
                    <div className="flex space-x-3">
                      <Input
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
