import { getSocket, isSocketConnected } from "@/lib/socket";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket] = useState<Socket>(() => getSocket());
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Set initial connection state
    const initialState = isSocketConnected();
    setIsConnected(initialState);

    if (initialState) {
      console.log("✅ Initial connection established");
    }

    // Handle connection events
    const handleConnect = () => {
      console.log("✅ Socket reconnected");
      setIsConnected(true);
    };

    const handleDisconnect = (reason: string) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    };

    const handleConnectError = (error: Error) => {
      console.error("⚠️ Socket connection error:", error.message);
      setIsConnected(false);
    };

    const handleReconnectAttempt = (attemptNumber: number) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
    };

    const handleReconnectFailed = () => {
      console.error("❌ Failed to reconnect to server");
    };

    // Attach event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.io.on("reconnect_attempt", handleReconnectAttempt);
    socket.io.on("reconnect_failed", handleReconnectFailed);

    // Cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.io.off("reconnect_attempt", handleReconnectAttempt);
      socket.io.off("reconnect_failed", handleReconnectFailed);
    };
  }, [socket]);

  // Memoize context value to prevent unnecessary rerenders
  const contextValue = useMemo(
    () => ({ socket, isConnected }),
    [socket, isConnected]
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
