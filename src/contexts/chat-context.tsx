'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useSocket } from './socket-context';

// Chat message interface
export interface ChatMessage {
  id: string;
  message: string;
  timestamp: Date;
  isOwn: boolean;
  conversationId: string;
  content_type: string;
  content: string;
  created_at: string;
  user_id?: string;
  username?: string;
}

// Conversation interface
export interface Conversation {
  id: string;
  type: 'private' | 'group';
  title: string | null;
  created_at: string;
  updated_at: string;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
  user_role: string;
  other_user?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    last_seen?: string | 'online';
  };
}

// Chat state interface
export interface ChatState {
  selectedConversation: string | null;
  messages: Map<string, ChatMessage[]>; // conversationId -> messages
  typingUsers: Map<string, Set<string>>; // conversationId -> typing users
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
}

// Chat actions interface
export interface ChatActions {
  // Conversation management
  selectConversation: (conversationId: string) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;

  // Message management
  sendMessage: (conversationId: string, content: string, contentType?: string, attachments?: any) => Promise<void>;
  addMessage: (conversationId: string, message: ChatMessage) => void;

  // Typing indicators
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;

  // Data management
  setConversations: (conversations: Conversation[]) => void;
  clearMessages: (conversationId: string) => void;

  // Utility
  getMessages: (conversationId: string) => ChatMessage[];
  getTypingUsers: (conversationId: string) => string[];
}

// Combined context value
export interface ChatContextValue {
  state: ChatState;
  actions: ChatActions;
}

// Context creation
const ChatContext = createContext<ChatContextValue | undefined>(undefined);

// Provider props
interface ChatProviderProps {
  children: ReactNode;
}

// Hook to use chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export function ChatProvider({ children }: ChatProviderProps) {
  const { state: socketState, actions: socketActions } = useSocket();
  const { isConnected, isAuthenticated } = socketState;
  const { emit, on, off } = socketActions;

  // Chat state
  const [state, setState] = useState<ChatState>({
    selectedConversation: null,
    messages: new Map(),
    typingUsers: new Map(),
    conversations: [],
    isLoading: false,
    error: null,
  });

  // Update chat state
  const updateState = useCallback((updates: Partial<ChatState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Select a conversation
  const selectConversation = useCallback((conversationId: string) => {
    updateState({ selectedConversation: conversationId });
  }, [updateState]);

  // Join a conversation
  const joinConversation = useCallback((conversationId: string) => {
    if (!isConnected || !isAuthenticated) {
      console.warn('Cannot join conversation: socket not ready');
      return;
    }

    // Leave previous conversation if any
    if (state.selectedConversation && state.selectedConversation !== conversationId) {
      emit('leave_conversation', { conversationId: state.selectedConversation });
      console.log('Left conversation:', state.selectedConversation);
    }

    // Join new conversation using the socket event
    emit('join_conversation', { conversationId });
    console.log('Joining conversation:', conversationId);

    // Update selected conversation
    updateState({ selectedConversation: conversationId });
  }, [isConnected, isAuthenticated, state.selectedConversation, emit, updateState]);

  // Leave a conversation
  const leaveConversation = useCallback((conversationId: string) => {
    if (!isConnected || !isAuthenticated) return;

    emit('leave_conversation', { conversationId });
    console.log('Left conversation:', conversationId);

    // Clear messages for this conversation
    const newMessages = new Map(state.messages);
    newMessages.delete(conversationId);

    // Clear typing users for this conversation
    const newTypingUsers = new Map(state.typingUsers);
    newTypingUsers.delete(conversationId);

    updateState({
      messages: newMessages,
      typingUsers: newTypingUsers,
      selectedConversation: state.selectedConversation === conversationId ? null : state.selectedConversation
    });
  }, [isConnected, isAuthenticated, state.messages, state.typingUsers, state.selectedConversation, emit, updateState]);

  // Add a message to a conversation
  const addMessage = useCallback((conversationId: string, message: ChatMessage) => {
    const newMessages = new Map(state.messages);
    const conversationMessages = newMessages.get(conversationId) || [];

    // Check if message already exists
    if (!conversationMessages.find(msg => msg.id === message.id)) {
      newMessages.set(conversationId, [...conversationMessages, message]);
      updateState({ messages: newMessages });
    }
  }, [state.messages, updateState]);

  // Send a message to a specific conversation
  const sendMessage = useCallback(async (conversationId: string, content: string, contentType: string = 'text', attachments?: any) => {
    if (!isConnected || !isAuthenticated || !content.trim()) {
      throw new Error('Cannot send message: socket not ready or content empty');
    }

    // Send a simple text message
    emit('message_sent', {
      message: {
        id: Date.now(), // Temporary ID
        content: content.trim(),
        content_type: contentType,
        conversation_id: conversationId,
        created_at: new Date().toISOString()
      },
      conversationId: conversationId
    });

    console.log('📤 Message sent:', content.trim());

    // Create local message object for immediate display
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message: content.trim(),
      timestamp: new Date(),
      isOwn: true,
      conversationId: conversationId,
      content_type: contentType,
      content: content.trim(),
      created_at: new Date().toISOString()
    };

    // Add message to local state
    addMessage(conversationId, newMessage);
  }, [isConnected, isAuthenticated, emit, addMessage]);

  // Start typing indicator
  const startTyping = useCallback((conversationId: string) => {
    if (!isConnected || !isAuthenticated) {
      console.log('❌ Cannot start typing: socket not ready', { isConnected, isAuthenticated });
      return;
    }

    console.log('🚀 About to emit user_typing event (start):', { conversationId, socketState: { isConnected, isAuthenticated } });
    emit('user_typing', {
      conversationId,
      isTyping: true,
      timestamp: new Date().toISOString()
    });
    console.log('⌨️ Started typing indicator for conversation:', conversationId);

    // Don't update local state for current user - only emit to others
  }, [isConnected, isAuthenticated, emit]);

  // Stop typing indicator
  const stopTyping = useCallback((conversationId: string) => {
    if (!isConnected || !isAuthenticated) {
      console.log('❌ Cannot stop typing: socket not ready', { isConnected, isAuthenticated });
      return;
    }

    console.log('🚀 About to emit user_typing event (stop):', { conversationId, socketState: { isConnected, isAuthenticated } });
    emit('user_typing', {
      conversationId,
      isTyping: false,
      timestamp: new Date().toISOString()
    });
    console.log('🛑 Stopped typing indicator for conversation:', conversationId);

    // Don't update local state for current user - only emit to others
  }, [isConnected, isAuthenticated, emit]);

  // Set conversations data
  const setConversations = useCallback((conversations: Conversation[]) => {
    updateState({ conversations });
  }, [updateState]);

  // Clear messages for a conversation
  const clearMessages = useCallback((conversationId: string) => {
    const newMessages = new Map(state.messages);
    newMessages.delete(conversationId);
    updateState({ messages: newMessages });
  }, [state.messages, updateState]);

  // Get messages for a conversation
  const getMessages = useCallback((conversationId: string) => {
    return state.messages.get(conversationId) || [];
  }, [state.messages]);

  // Get typing users for a conversation
  const getTypingUsers = useCallback((conversationId: string) => {
    return Array.from(state.typingUsers.get(conversationId) || []);
  }, [state.typingUsers]);

  // Socket event listeners
  useEffect(() => {
    if (!isConnected || !isAuthenticated) return;

    // Listen for new messages
    const handleNewMessage = (data: any) => {
      console.log('📨 Received new message event:', data);

      // Check if the message is for any of our conversations
      const conversationId = data.conversationId || data.message?.conversation_id;
      console.log('🔍 Checking conversation ID:', conversationId);
      console.log('📋 Available conversations:', state.conversations.map(c => c.id));

      if (conversationId && state.conversations.some(conv => conv.id === conversationId)) {
        console.log('✅ Message belongs to our conversation, processing...');

        const newMessage: ChatMessage = {
          id: data.message.id || Date.now().toString(),
          message: data.message.content || data.message.message,
          timestamp: new Date(data.message.timestamp || data.message.created_at),
          isOwn: false,
          conversationId: conversationId,
          content_type: data.message.content_type || 'text',
          content: data.message.content || data.message.message,
          created_at: data.message.created_at || new Date().toISOString()
        };

        console.log('💬 Adding new message to conversation:', newMessage);
        addMessage(conversationId, newMessage);
        console.log('✅ Message added successfully!');
      } else {
        console.log('❌ Message not for our conversations or no conversations loaded');
      }
    };

    // Listen for typing indicators
    const handleUserTyping = (data: any) => {
      console.log('Typing event received:', data);
      // data contains: { userId, userEmail, conversationId, isTyping, timestamp }

      const conversationId = data.conversationId;
      console.log('🔍 Processing typing event for conversation:', conversationId);
      console.log('📋 Available conversations:', state.conversations.map(c => c.id));

      if (conversationId) {
        const newTypingUsers = new Map(state.typingUsers);
        const currentTyping = newTypingUsers.get(conversationId) || new Set();
        const userIdentifier = data.userEmail || data.userId?.toString() || 'Unknown User';

        if (data.isTyping) {
          // User started typing
          currentTyping.add(userIdentifier);
          console.log('✅ Typing indicator shown for:', userIdentifier, 'in conversation:', conversationId);
        } else {
          // User stopped typing
          currentTyping.delete(userIdentifier);
          console.log('🛑 Typing indicator hidden for:', userIdentifier, 'in conversation:', conversationId);
        }

        if (currentTyping.size === 0) {
          newTypingUsers.delete(conversationId);
        } else {
          newTypingUsers.set(conversationId, currentTyping);
        }

        updateState({ typingUsers: newTypingUsers });
        console.log('📊 Current typing users:', Array.from(currentTyping));
      } else {
        console.log('❌ No conversationId in typing event');
      }
    };

    // Listen for conversation join confirmation
    const handleJoinedConversation = (data: any) => {
      console.log('✅ Successfully joined conversation:', data.conversationId);
    };

    // Listen for conversation join errors
    const handleJoinError = (data: any) => {
      console.error('❌ Failed to join conversation:', data);
      updateState({ error: `Failed to join conversation: ${data.message || 'Unknown error'}` });
    };

    // Listen for socket errors
    const handleSocketError = (error: any) => {
      console.error('❌ Socket error:', error);
      updateState({ error: `Socket error: ${error.message || 'Unknown error' }` });
    };

    // Register event listeners
    on('new_message', handleNewMessage);
    on('message_sent', handleNewMessage);
    on('user_typing', handleUserTyping);
    on('conversation_joined', handleJoinedConversation);
    on('error', handleSocketError);

    // Cleanup
    return () => {
      off('new_message', handleNewMessage);
      off('message_sent', handleNewMessage);
      off('user_typing', handleUserTyping);
      off('conversation_joined', handleJoinedConversation);
      off('error', handleSocketError);
    };
  }, [isConnected, isAuthenticated, state.conversations, addMessage, state.typingUsers, updateState, on, off]);

  // Cleanup: Leave conversation when disconnecting
  useEffect(() => {
    if (!isConnected && state.selectedConversation) {
      updateState({ selectedConversation: null });
    }
  }, [isConnected, state.selectedConversation, updateState]);

  // Context value
  const contextValue: ChatContextValue = {
    state,
    actions: {
      selectConversation,
      joinConversation,
      leaveConversation,
      sendMessage,
      addMessage,
      startTyping,
      stopTyping,
      setConversations,
      clearMessages,
      getMessages,
      getTypingUsers,
    },
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}
