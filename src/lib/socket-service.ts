import { io, Socket } from "socket.io-client";

type SocketEvent =
  | "socket_connected"
  | "socket_disconnected"
  | "socket_connection_error"
  | "socket_authenticated"
  | "socket_authentication_error"
  | "user_connected"
  | "user_disconnected"
  | "socket_reconnected"
  | "socket_reconnect_attempt"
  | "socket_reconnection_error"
  | "socket_reconnect_failed";

class SocketService {
  private socket: Socket | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private accessToken: string | null = null;

  // Socket connection status
  public isConnected = false;
  public isAuthenticated = false;

  // Local app event listeners
  private eventListeners: Map<string, ((...args: any[]) => void)[]> = new Map();

  constructor() {
    this.init();
  }

  private init() {
    try {
      this.socket = io(
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4041",
        {
          transports: ["websocket", "polling"],
          autoConnect: false,
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: 1000,
          timeout: 20000,
        }
      );

      this.setupEventListeners();
    } catch (error) {
      console.error("Failed to initialize socket:", error);
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.isConnected = true;
      this.isConnecting = false;
      this.reconnectAttempts = 0;

      // Automatically authenticate if we have an access token
      if (this.accessToken) {
        console.log('Auto-authenticating with stored token...');
        this.authenticate(this.accessToken);
      }

      this.dispatchEvent('socket_connected');
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      this.isConnected = false;
      this.isAuthenticated = false;
      this.dispatchEvent("socket_disconnected", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.isConnecting = false;
      this.dispatchEvent("socket_connection_error", error);
    });

    // Authentication events
    this.socket.on("authenticated", (data) => {
      console.log("Socket authenticated:", data);
      this.isAuthenticated = true;
      this.dispatchEvent("socket_authenticated", data);
    });

    this.socket.on("authentication_error", (error) => {
      console.error("Socket authentication error:", error);
      this.isAuthenticated = false;
      this.dispatchEvent("socket_authentication_error", error);
    });

    // User events
    this.socket.on("user_connected", (data) => {
      console.log("User connected:", data);
      this.dispatchEvent("user_connected", data);
    });

    this.socket.on("user_disconnected", (data) => {
      console.log("User disconnected:", data);
      this.dispatchEvent("user_disconnected", data);
    });

    // Reconnection events
    this.socket.on("reconnect", (attemptNumber) => {
      console.log("Socket reconnected after", attemptNumber, "attempts");
      this.reconnectAttempts = 0;
      this.dispatchEvent("socket_reconnected", attemptNumber);
    });

    this.socket.on("reconnect_attempt", (attemptNumber) => {
      console.log("Socket reconnection attempt:", attemptNumber);
      this.reconnectAttempts = attemptNumber;
      this.dispatchEvent("socket_reconnect_attempt", attemptNumber);
    });

    this.socket.on("reconnect_error", (error) => {
      console.error("Socket reconnection error:", error);
      this.dispatchEvent("socket_reconnection_error", error);
    });

    this.socket.on("reconnect_failed", () => {
      console.error(
        "Socket reconnection failed after",
        this.maxReconnectAttempts,
        "attempts"
      );
      this.dispatchEvent("socket_reconnect_failed");
    });
  }

  // Connect to socket server
  public connect(accessToken?: string) {
    if (this.isConnecting || this.isConnected) return;

    // Store the access token if provided
    if (accessToken) {
      this.accessToken = accessToken;
    }

    try {
      this.isConnecting = true;
      this.socket?.connect();
    } catch (error) {
      console.error('Failed to connect socket:', error);
      this.isConnecting = false;
    }
  }

  // Disconnect and cleanup
  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
      this.isAuthenticated = false;
      this.isConnecting = false;
      this.accessToken = null;
      this.eventListeners.clear();
    }
  }

  // Authenticate with access token
  public authenticate(accessToken: string) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected. Cannot authenticate.');
      return;
    }

    try {
      console.log('Authenticating socket with token...');
      // Emit the authenticate event with the token as expected by the backend
      this.socket.emit('authenticate', { token: accessToken });
    } catch (error) {
      console.error('Failed to authenticate socket:', error);
    }
  }

  // Emit event to server
  public emitToServer(event: string, data?: any) {
    if (!this.socket || !this.isConnected) {
      console.log(`Socket not connected. Cannot emit event: ${event}`);
      return;
    }

    try {
      this.socket.emit(event, data);
    } catch (error) {
      console.error("Failed to emit event to server:", event, error);
    }
  }

  // Listen to custom server events (for messages, etc.)
  public onCustom(event: string, callback: (...args: any[]) => void) {
    if (!this.socket) return;
    this.socket.on(event, callback);
  }

  // Remove custom server event listener
  public offCustom(event: string, callback?: (...args: any[]) => void) {
    if (!this.socket) return;
    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }

  // Listen to local events
  public on(event: SocketEvent, callback: (...args: any[]) => void) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)?.push(callback);
  }

  // Remove local event listener
  public off(event: SocketEvent, callback?: (...args: any[]) => void) {
    if (!callback) {
      this.eventListeners.delete(event);
    } else {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    }
  }

  // Dispatch local events
  private dispatchEvent(event: SocketEvent, ...args: any[]) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Get socket instance (for advanced usage)
  public getSocket(): Socket | null {
    return this.socket;
  }

  // Get connection status
  public getStatus() {
    return {
      isConnected: this.isConnected,
      isAuthenticated: this.isAuthenticated,
      isConnecting: this.isConnecting,
      reconnectAttempts: this.reconnectAttempts,
    };
  }
}

// Singleton instance
const socketService = new SocketService();
export default socketService;
