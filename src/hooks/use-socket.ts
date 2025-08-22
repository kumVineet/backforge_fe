import { useEffect, useRef, useState, useCallback } from 'react';
import socketService from '@/lib/socket-service';
import { useAuthStore } from '@/lib/auth-store';

export const useSocket = () => {
  const { accessToken, isAuthenticated } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const [isSocketAuthenticated, setIsSocketAuthenticated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const eventListenersRef = useRef<Map<string, (...args: any[]) => void>>(new Map());

  // Connect to socket
  const connect = useCallback(() => {
    if (!isAuthenticated || !accessToken) {
      console.log('User not authenticated, cannot connect socket');
      return;
    }

    socketService.connect(accessToken);
  }, [isAuthenticated, accessToken]);

  // Disconnect from socket
  const disconnect = useCallback(() => {
    socketService.disconnect();
  }, []);

  // Authenticate socket with token
  const authenticate = useCallback((token: string) => {
    if (socketService.isConnected) {
      socketService.authenticate(token);
    }
  }, []);

  // Emit custom events
  const emit = useCallback((event: string, data?: any) => {
    socketService.emitToServer(event, data);
  }, []);

  // Listen to custom events
  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    // Store reference to remove later
    eventListenersRef.current.set(event, callback);
    socketService.onCustom(event, callback);
  }, []);

  // Remove event listener
  const off = useCallback((event: string) => {
    const callback = eventListenersRef.current.get(event);
    if (callback) {
      socketService.offCustom(event, callback);
      eventListenersRef.current.delete(event);
    }
  }, []);

  // Get socket status
  const getStatus = useCallback(() => {
    return socketService.getStatus();
  }, []);

  useEffect(() => {
    // Listen to socket connection events
    const handleSocketConnected = () => {
      console.log('Socket connected in hook');
      setIsConnected(true);
      setIsConnecting(false);
      setReconnectAttempts(0);

      // Authenticate immediately after connection
      if (accessToken) {
        authenticate(accessToken);
      }
    };

    const handleSocketDisconnected = (reason: string) => {
      console.log('Socket disconnected in hook:', reason);
      setIsConnected(false);
      setIsSocketAuthenticated(false);
      setIsConnecting(false);
    };

    const handleSocketAuthenticated = (data: any) => {
      console.log('Socket authenticated in hook:', data);
      setIsSocketAuthenticated(true);
    };

    const handleSocketAuthenticationError = (error: any) => {
      console.error('Socket authentication error in hook:', error);
      setIsSocketAuthenticated(false);
    };

    const handleSocketConnectionError = (error: any) => {
      console.error('Socket connection error in hook:', error);
      setIsConnecting(false);
    };

    const handleSocketReconnectAttempt = (attemptNumber: number) => {
      console.log('Socket reconnection attempt in hook:', attemptNumber);
      setReconnectAttempts(attemptNumber);
    };

    const handleSocketReconnected = (attemptNumber: number) => {
      console.log('Socket reconnected in hook after', attemptNumber, 'attempts');
      setReconnectAttempts(0);

      // Re-authenticate after reconnection
      if (accessToken) {
        authenticate(accessToken);
      }
    };

    // Register event listeners
    socketService.on('socket_connected', handleSocketConnected);
    socketService.on('socket_disconnected', handleSocketDisconnected);
    socketService.on('socket_authenticated', handleSocketAuthenticated);
    socketService.on('socket_authentication_error', handleSocketAuthenticationError);
    socketService.on('socket_connection_error', handleSocketConnectionError);
    socketService.on('socket_reconnect_attempt', handleSocketReconnectAttempt);
    socketService.on('socket_reconnected', handleSocketReconnected);

    // Auto-connect when user is authenticated
    if (isAuthenticated && accessToken) {
      connect();
    }

    // Cleanup function
    return () => {
      socketService.off('socket_connected', handleSocketConnected);
      socketService.off('socket_disconnected', handleSocketDisconnected);
      socketService.off('socket_authenticated', handleSocketAuthenticated);
      socketService.off('socket_authentication_error', handleSocketAuthenticationError);
      socketService.off('socket_connection_error', handleSocketConnectionError);
      socketService.off('socket_reconnect_attempt', handleSocketReconnectAttempt);
      socketService.off('socket_reconnected', handleSocketReconnected);

      // Clean up custom event listeners
      eventListenersRef.current.forEach((callback, event) => {
        socketService.offCustom(event, callback);
      });
      eventListenersRef.current.clear();
    };
  }, [isAuthenticated, accessToken, connect, authenticate]);

  // Auto-connect when authentication state changes
  useEffect(() => {
    if (isAuthenticated && accessToken && !isConnected && !isConnecting) {
      connect();
    } else if (!isAuthenticated && isConnected) {
      disconnect();
    }
  }, [isAuthenticated, accessToken, isConnected, isConnecting, connect, disconnect]);


  return {
    // Connection state
    isConnected,
    isAuthenticated: isSocketAuthenticated,
    isConnecting,
    reconnectAttempts,

    // Actions
    connect,
    disconnect,
    authenticate,
    emit,
    on,
    off,
    getStatus,

    // Socket service instance (for advanced usage)
    socketService,
  };
};
