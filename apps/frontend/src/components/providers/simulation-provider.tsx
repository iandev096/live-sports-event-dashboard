import {
  clearMatchId,
  createShareableUrl,
  generateMatchId,
  getMatchId,
  getMatchIdFromUrl,
  getUserId,
  isMatchOwner,
  isViewerModeFromUrl,
  setMatchId,
  setOriginalOwner,
  setViewingMode,
} from "@/lib/user-session";
import type {
  MatchEvent,
  MatchState,
  Poll,
  ServerMatchEvent,
} from "@repo/shared-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSocket } from "./socket-provider";

interface SimulationContextType {
  // State
  matchState: MatchState | null;
  events: MatchEvent[];
  isSimulationRunning: boolean;
  isOwner: boolean;
  matchId: string;
  userId: string;
  shareableUrl: string;

  // Poll State
  poll: Poll | null;
  hasVoted: boolean;
  userVote: string | null; // optionId

  // Actions
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

const SimulationContext = createContext<SimulationContextType | undefined>(
  undefined
);

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
};

interface SimulationProviderProps {
  children: React.ReactNode;
}

export const SimulationProvider = ({ children }: SimulationProviderProps) => {
  const { socket, isConnected } = useSocket();
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [userId] = useState<string>(() => getUserId());

  // Poll state
  const [poll, setPoll] = useState<Poll | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState<string | null>(null);

  // Initialize match ID from URL or localStorage
  const [currentMatchId, setCurrentMatchId] = useState<string>(() => {
    const urlMatchId = getMatchIdFromUrl();
    if (urlMatchId) {
      setMatchId(urlMatchId); // Save to localStorage
      return urlMatchId;
    }

    // Check if we have a stored match ID
    const storedMatchId = getMatchId();

    // If stored match ID doesn't belong to current user, clear it and create new one
    if (!isMatchOwner(storedMatchId, userId)) {
      clearMatchId();
      return generateMatchId(userId);
    }

    return storedMatchId;
  });

  // Determine if user is owner or viewer
  const [isOwner, setIsOwner] = useState<boolean>(() => {
    // If URL explicitly says viewer mode, honor it
    if (isViewerModeFromUrl()) {
      setViewingMode("viewer");
      return false;
    }

    // Otherwise, always owner for their own match
    setViewingMode("owner");
    return true;
  });

  const [shareableUrl, setShareableUrl] = useState<string>(() =>
    createShareableUrl(currentMatchId)
  );

  // Join match on mount or when connection changes
  useEffect(() => {
    if (isConnected && socket) {
      // Only join on initial connection, not when currentMatchId changes
      // (currentMatchId changes are handled by explicit joinMatch calls)
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

  // Handle incoming simulation events
  useEffect(() => {
    if (!socket) return;

    const handleSimulationEvent = (event: ServerMatchEvent) => {
      // Only log important events, not every single one
      if (["match-start", "score-update", "match-state"].includes(event.type)) {
        console.log("📡", event.type, event);
      }

      switch (event.type) {
        case "match-start":
          setIsSimulationRunning(true);
          setMatchState({
            matchId: event.matchId,
            teamA: event.teamA,
            teamB: event.teamB,
            scoreA: 0,
            scoreB: 0,
            currentTime: 0,
            phase: "first-half",
            isLive: true,
            startTime: new Date(event.startTime),
          });
          setEvents([]);
          break;

        case "match-state":
          setMatchState(event.state);
          setIsSimulationRunning(event.state.isLive);
          break;

        case "match-event":
          setEvents((prev) => {
            // Check if event already exists to prevent duplicates
            const exists = prev.some(
              (e) =>
                e.minute === event.event.minute &&
                e.description === event.event.description
            );
            if (exists) return prev;
            return [...prev, event.event];
          });
          break;

        case "score-update":
          setMatchState((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              scoreA: event.teamA,
              scoreB: event.teamB,
            };
          });
          break;

        case "time-update":
          setMatchState((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              currentTime: event.currentTime,
              phase: event.phase,
            };
          });
          // Stop simulation if phase is full-time
          if (event.phase === "full-time") {
            setIsSimulationRunning(false);
          }
          break;

        case "new-commentary":
          setEvents((prev) => {
            const commentaryEvent: MatchEvent = {
              minute: event.minute,
              type: "commentary",
              description: event.text,
              player: event.player,
            };
            // Check if event already exists
            const exists = prev.some(
              (e) =>
                e.minute === commentaryEvent.minute &&
                e.description === commentaryEvent.description
            );
            if (exists) return prev;
            return [...prev, commentaryEvent];
          });
          break;
      }
    };

    const handleSimulationResponse = (response: any) => {
      console.log("Simulation response:", response);
      if (response.action === "start" && response.success) {
        setIsSimulationRunning(true);
      } else if (response.action === "pause" && response.success) {
        setIsSimulationRunning(false);
      } else if (response.action === "resume" && response.success) {
        setIsSimulationRunning(true);
      } else if (response.action === "reset" && response.success) {
        // Reset completely clears the simulation
        setIsSimulationRunning(false);
        setMatchState(null);
        setEvents([]);
        // Clear poll state on reset
        setPoll(null);
        setHasVoted(false);
        setUserVote(null);
        console.log("✅ Simulation reset - ready for fresh start");
      }
    };

    socket.on("simulation-event", handleSimulationEvent);
    socket.on("simulation-response", handleSimulationResponse);

    return () => {
      socket.off("simulation-event", handleSimulationEvent);
      socket.off("simulation-response", handleSimulationResponse);
    };
  }, [socket]);

  // Handle poll events
  useEffect(() => {
    if (!socket) return;

    const handlePollCreated = (pollData: Poll) => {
      console.log("📊 Poll created:", pollData);
      setPoll(pollData);
    };

    const handlePollUpdated = (pollData: Poll) => {
      console.log("📊 Poll updated:", pollData);
      setPoll(pollData);
    };

    const handlePollEnded = (pollData: Poll) => {
      console.log("🏁 Poll ended:", pollData);
      setPoll(pollData);
    };

    const handleVoteStatus = (data: {
      hasVoted: boolean;
      userVote: string | null;
    }) => {
      console.log("✅ Vote status received:", data);
      setHasVoted(data.hasVoted);
      setUserVote(data.userVote);
    };

    const handleVotePollResponse = (data: {
      success: boolean;
      message: string;
      poll?: Poll;
      hasVoted: boolean;
      userVote: string | null;
    }) => {
      console.log("📊 Vote poll response:", data);
      if (data.success && data.poll) {
        setPoll(data.poll);
        setHasVoted(data.hasVoted);
        setUserVote(data.userVote);
      } else {
        console.error("Vote failed:", data.message);
        // TODO: Show error toast to user
      }
    };

    socket.on("poll-created", handlePollCreated);
    socket.on("poll-updated", handlePollUpdated);
    socket.on("poll-ended", handlePollEnded);
    socket.on("vote-status", handleVoteStatus);
    socket.on("vote-poll-response", handleVotePollResponse);

    return () => {
      socket.off("poll-created", handlePollCreated);
      socket.off("poll-updated", handlePollUpdated);
      socket.off("poll-ended", handlePollEnded);
      socket.off("vote-status", handleVoteStatus);
      socket.off("vote-poll-response", handleVotePollResponse);
    };
  }, [socket]);

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

        // Clear old match state
        setMatchState(null);
        setEvents([]);
        setIsSimulationRunning(false);

        // Clear poll state
        setPoll(null);
        setHasVoted(false);
        setUserVote(null);
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
      setShareableUrl(createShareableUrl(matchToJoin));
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

      if (hasVoted) {
        console.warn("⚠️ You have already voted");
        return;
      }

      console.log(`📊 Voting for option: ${optionId}`);
      socket.emit("vote-poll", {
        matchId: currentMatchId,
        userId,
        optionId,
      });
    },
    [socket, currentMatchId, userId, hasVoted]
  );

  return (
    <SimulationContext.Provider
      value={{
        matchState,
        events,
        isSimulationRunning,
        isOwner,
        matchId: currentMatchId,
        userId,
        shareableUrl,
        poll,
        hasVoted,
        userVote,
        startSimulation,
        pauseSimulation,
        resumeSimulation,
        resetSimulation,
        joinMatch,
        leaveMatch,
        copyShareLink,
        votePoll,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};
