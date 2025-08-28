'use client';

import React, { createContext, useContext, useEffect, useCallback, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import io, { Socket } from 'socket.io-client';
import { useAuthStore } from '@/lib/auth-store';

// Socket connection states
export interface SocketState {
  isConnected: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  userEmail: string | null;
  error: string | null;
}

// Socket actions
export interface SocketActions {
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback?: (...args: any[]) => void) => void;
}

// Combined context value
export interface SocketContextValue {
  state: SocketState;
  actions: SocketActions;
}

// Context creation
const SocketContext = createContext<SocketContextValue | undefined>(undefined);

// Provider props
interface SocketProviderProps {
  children: ReactNode;
}

// Hook to use socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// Hook to check if socket should be connected (for chat page)
export const useSocketConnection = () => {
  const { state, actions } = useSocket();
  const { isAuthenticated: isUserAuthenticated, accessToken } = useAuthStore();
  const pathname = usePathname();

  // Only connect on chat page when user is authenticated
  const shouldConnect = isUserAuthenticated && !!accessToken && pathname === '/chat';

  return {
    ...state,
    shouldConnect,
    actions
  };
};

export function SocketProvider({ children }: SocketProviderProps) {
  const { accessToken, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Socket state
  const [state, setState] = React.useState<SocketState>({
    isConnected: false,
    isAuthenticated: false,
    userId: null,
    userEmail: null,
    error: null,
  });

  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [eventListeners, setEventListeners] = React.useState<Map<string, ((...args: any[]) => void)[]>>(new Map());

  // Update socket state
  const updateState = useCallback((updates: Partial<SocketState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    // Only connect if we're on the chat page
    if (pathname !== '/chat') return;

    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      updateState({ isConnected: true, error: null });

      // Authenticate immediately after connection
      newSocket.emit('authenticate', { token: accessToken });
    });

    newSocket.on('authenticated', (data: any) => {
      console.log('Socket authenticated:', data);
      updateState({
        isAuthenticated: true,
        userId: data.userId,
        userEmail: data.userEmail,
        error: null
      });
    });

    newSocket.on('authentication_error', (error: any) => {
      console.error('Socket authentication error:', error);
      updateState({
        isAuthenticated: false,
        error: error.message || 'Authentication failed'
      });
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      updateState({
        isConnected: false,
        isAuthenticated: false
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [isAuthenticated, accessToken, pathname, updateState]);

  // Generic event emitter
  const emit = useCallback((event: string, data?: any) => {
    if (socket && state.isConnected && state.isAuthenticated) {
      console.log('Emitting event:', event, data);
      socket.emit(event, data);
    } else {
      console.warn('Socket not ready for emitting events');
    }
  }, [socket, state.isConnected, state.isAuthenticated]);

  // Generic event listener
  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    if (socket) {
      socket.on(event, callback);

      // Store listener for cleanup
      setEventListeners(prev => {
        const newMap = new Map(prev);
        if (!newMap.has(event)) {
          newMap.set(event, []);
        }
        const listeners = newMap.get(event)!;
        listeners.push(callback);
        newMap.set(event, listeners);
        return newMap;
      });
    }
  }, [socket]);

  // Remove event listener
  const off = useCallback((event: string, callback?: (...args: any[]) => void) => {
    if (socket) {
      if (callback) {
        socket.off(event, callback);

        // Remove from stored listeners
        setEventListeners(prev => {
          const newMap = new Map(prev);
          if (newMap.has(event)) {
            const listeners = newMap.get(event)!.filter(cb => cb !== callback);
            if (listeners.length === 0) {
              newMap.delete(event);
            } else {
              newMap.set(event, listeners);
            }
          }
          return newMap;
        });
      } else {
        // Remove all listeners for this event
        socket.off(event);
        setEventListeners(prev => {
          const newMap = new Map(prev);
          newMap.delete(event);
          return newMap;
        });
      }
    }
  }, [socket]);

  // Cleanup event listeners
  useEffect(() => {
    return () => {
      if (socket) {
        eventListeners.forEach((listeners, event) => {
          listeners.forEach(callback => {
            socket.off(event, callback);
          });
        });
      }
    };
  }, [socket, eventListeners]);

  // Handle authentication state changes
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      // User is not authenticated, disconnect if connected
      if (socket && state.isConnected) {
        socket.close();
        setSocket(null);
        updateState({
          isConnected: false,
          isAuthenticated: false,
          userId: null,
          userEmail: null,
          error: null
        });
      }
    }
  }, [isAuthenticated, accessToken, socket, state.isConnected, updateState]);

  // Handle page navigation
  useEffect(() => {
    if (pathname !== '/chat') {
      // User left chat page, disconnect
      if (socket && state.isConnected) {
        socket.close();
        setSocket(null);
        updateState({
          isConnected: false,
          isAuthenticated: false,
          userId: null,
          userEmail: null,
          error: null
        });
      }
    }
  }, [pathname, socket, state.isConnected, updateState]);

  // Context value
  const contextValue: SocketContextValue = {
    state,
    actions: {
      emit,
      on,
      off,
    },
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}
