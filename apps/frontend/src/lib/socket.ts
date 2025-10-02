import { io, Socket } from "socket.io-client";

// Get backend URL from environment or use default
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

// Singleton socket instance
let socket: Socket | null = null;

/**
 * Get or create socket connection
 */
export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(BACKEND_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Global connection event handlers
    socket.on("connect", () => {
      console.log("✅ Connected to backend:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from backend:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error.message);
    });
  }

  return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Check if socket is connected
 */
export const isSocketConnected = (): boolean => {
  return socket?.connected ?? false;
};
