import { useSocket } from "@/components/providers/socket-provider";
import type { MatchEvent, Poll, ServerMatchEvent } from "@repo/shared-types";
import { useEffect } from "react";
import { useEvents } from "./events-provider";
import { useMatchState } from "./match-state-provider";

/**
 * SimulationCoordinator handles socket events and coordinates updates
 * across the three separate context providers (MatchState, Events, Actions).
 *
 * This component doesn't render anything - it just listens to socket events
 * and updates the appropriate context states.
 */
export const SimulationCoordinator = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { socket } = useSocket();
  const { setMatchState, setIsSimulationRunning } = useMatchState();
  const { setEvents, setPoll, setHasVoted, setUserVote } = useEvents();

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
  }, [
    socket,
    setMatchState,
    setIsSimulationRunning,
    setEvents,
    setPoll,
    setHasVoted,
    setUserVote,
  ]);

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
  }, [socket, setPoll, setHasVoted, setUserVote]);

  return <>{children}</>;
};
