import { useSocket } from "@/components/providers/socket-provider";
import {
  getUserId,
  isMatchOwner,
  setMatchId,
  setOriginalOwner,
  setViewingMode,
} from "@/lib/user-session";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface ActionsContextType {
  // User & Match Info
  isOwner: boolean;
  matchId: string;
  userId: string;
  shareableUrl: string;

  // Match Control Actions
  startSimulation: (teamA: string, teamB: string) => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  resetSimulation: () => void;
  joinMatch: (matchId?: string) => void;
  leaveMatch: () => void;
  copyShareLink: () => Promise<void>;

  // Poll Actions
  votePoll: (optionId: string) => void;
}

const ActionsContext = createContext<ActionsContextType | undefined>(undefined);

export const useActions = () => {
  const context = useContext(ActionsContext);
  if (!context) {
    throw new Error("useActions must be used within an ActionsProvider");
  }
  return context;
};

interface ActionsProviderProps {
  children: React.ReactNode;
  initialMatchId: string;
  initialIsOwner: boolean;
  initialShareableUrl: string;
}

export const ActionsProvider = ({
  children,
  initialMatchId,
  initialIsOwner,
  initialShareableUrl,
}: ActionsProviderProps) => {
  const { socket, isConnected } = useSocket();
  const [userId] = useState<string>(() => getUserId());
  const [currentMatchId, setCurrentMatchId] = useState<string>(initialMatchId);
  const [isOwner, setIsOwner] = useState<boolean>(initialIsOwner);
  const [shareableUrl, setShareableUrl] = useState<string>(initialShareableUrl);

  // Join match on mount or when connection changes
  useEffect(() => {
    if (isConnected && socket) {
      console.log("🔌 Connection established, joining initial match");
      socket.emit("join-match", { matchId: currentMatchId, userId });
    }

    return () => {
      if (socket && currentMatchId) {
        socket.emit("leave-match", currentMatchId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, socket]); // Removed currentMatchId from dependencies

  const joinMatch = useCallback(
    (targetMatchId?: string) => {
      if (!socket) {
        console.error("❌ Cannot join match: socket not connected");
        return;
      }

      const matchToJoin = targetMatchId || currentMatchId;

      // Leave current match first if switching
      if (matchToJoin !== currentMatchId) {
        socket.emit("leave-match", currentMatchId);
        console.log("⬅️ Leaving:", currentMatchId.substring(0, 30) + "...");
      }

      console.log(
        "➡️ Joining match as",
        isMatchOwner(matchToJoin, userId) ? "owner" : "viewer"
      );
      socket.emit("join-match", { matchId: matchToJoin, userId });
      setCurrentMatchId(matchToJoin);

      // Save to localStorage
      setMatchId(matchToJoin);

      // Check if user is the owner
      const ownerStatus = isMatchOwner(matchToJoin, userId);
      setIsOwner(ownerStatus);

      // If this user is the owner, mark them as the original owner
      if (ownerStatus) {
        setOriginalOwner(userId);
      }

      // Update viewing mode in localStorage
      const mode = ownerStatus ? "owner" : "viewer";
      setViewingMode(mode);

      // Update shareable URL
      const newUrl = `${window.location.origin}${window.location.pathname}?matchId=${matchToJoin}&mode=viewer`;
      setShareableUrl(newUrl);
    },
    [socket, currentMatchId, userId]
  );

  const leaveMatch = useCallback(() => {
    if (!socket) return;
    socket.emit("leave-match", currentMatchId);
  }, [socket, currentMatchId]);

  const startSimulation = useCallback(
    (teamA: string, teamB: string) => {
      if (!socket || !isOwner) return;

      console.log("▶️ Starting simulation:", teamA, "vs", teamB);
      socket.emit("start-simulation", {
        matchId: currentMatchId,
        teamA,
        teamB,
      });
    },
    [socket, currentMatchId, isOwner]
  );

  const pauseSimulation = useCallback(() => {
    if (!socket || !isOwner) return;

    console.log("⏸️ Pausing simulation");
    socket.emit("pause-simulation", currentMatchId);
  }, [socket, currentMatchId, isOwner]);

  const resumeSimulation = useCallback(() => {
    if (!socket || !isOwner) return;

    console.log("▶️ Resuming simulation");
    socket.emit("resume-simulation", currentMatchId);
  }, [socket, currentMatchId, isOwner]);

  const resetSimulation = useCallback(() => {
    if (!socket || !isOwner) return;

    console.log("🔄 Resetting simulation");
    socket.emit("reset-simulation", currentMatchId);
  }, [socket, currentMatchId, isOwner]);

  const copyShareLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      console.log("Share link copied to clipboard:", shareableUrl);
    } catch (error) {
      console.error("Failed to copy share link:", error);
      // Fallback: create a temporary input element
      const input = document.createElement("input");
      input.value = shareableUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
  }, [shareableUrl]);

  const votePoll = useCallback(
    (optionId: string) => {
      if (!socket) {
        console.error("❌ Cannot vote: socket not connected");
        return;
      }

      console.log(`📊 Voting for option: ${optionId}`);
      socket.emit("vote-poll", {
        matchId: currentMatchId,
        userId,
        optionId,
      });
    },
    [socket, currentMatchId, userId]
  );

  // Memoize context value - these are stable functions that rarely change
  const contextValue = useMemo(
    () => ({
      isOwner,
      matchId: currentMatchId,
      userId,
      shareableUrl,
      startSimulation,
      pauseSimulation,
      resumeSimulation,
      resetSimulation,
      joinMatch,
      leaveMatch,
      copyShareLink,
      votePoll,
    }),
    [
      isOwner,
      currentMatchId,
      userId,
      shareableUrl,
      startSimulation,
      pauseSimulation,
      resumeSimulation,
      resetSimulation,
      joinMatch,
      leaveMatch,
      copyShareLink,
      votePoll,
    ]
  );

  return (
    <ActionsContext.Provider value={contextValue}>
      {children}
    </ActionsContext.Provider>
  );
};
