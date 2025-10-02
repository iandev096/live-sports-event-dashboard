import { Server } from "socket.io";
import { SimulationManager } from "../services";
import { PollManager } from "../services/pollManager";

// Global manager instances
let simulationManager: SimulationManager;
let pollManager: PollManager;

export const setupSocket = (io: Server) => {
  // Initialize managers
  pollManager = new PollManager(io);
  simulationManager = new SimulationManager(io, pollManager);

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    // Join match room for live updates
    socket.on(
      "join-match",
      (data: string | { matchId: string; userId: string }) => {
        // Support both old format (string) and new format (object with userId)
        const matchId = typeof data === "string" ? data : data.matchId;
        const userId = typeof data === "object" ? data.userId : undefined;

        socket.join(matchId);
        console.log(`User ${socket.id} joined match ${matchId}`);

        // Send current match state if simulation is running
        const matchState = simulationManager.getMatchState(matchId);
        if (matchState) {
          socket.emit("simulation-event", {
            type: "match-state",
            matchId,
            state: matchState,
          });

          // Send past events for late joiners
          const pastEvents = simulationManager.getPastEvents(matchId);
          if (pastEvents.length > 0) {
            console.log(
              `📜 Sending ${pastEvents.length} past events to late joiner`
            );
            pastEvents.forEach((event) => {
              socket.emit("simulation-event", {
                type: "match-event",
                matchId,
                event,
              });
            });
          }
        }

        // Send current poll if it exists
        const poll = pollManager.getPoll(matchId);
        if (poll) {
          socket.emit("poll-created", poll);

          // If userId provided, send user's vote status
          if (userId) {
            const hasVoted = pollManager.hasUserVoted(matchId, userId);
            const userVote = pollManager.getUserVote(matchId, userId);

            socket.emit("vote-status", {
              hasVoted,
              userVote,
            });
          }
        }
      }
    );

    // Leave match room
    socket.on("leave-match", (matchId: string) => {
      socket.leave(matchId);
      console.log(`User ${socket.id} left match ${matchId}`);
    });

    // Request simulation status
    socket.on("get-simulation-status", (matchId: string) => {
      const status = simulationManager.getSimulationStatus(matchId);
      socket.emit("simulation-status", status);
    });

    // Request to start simulation
    socket.on(
      "start-simulation",
      (data: { matchId: string; teamA: string; teamB: string }) => {
        const { matchId, teamA, teamB } = data;
        const success = simulationManager.startSimulation(
          matchId,
          teamA,
          teamB
        );
        socket.emit("simulation-response", {
          action: "start",
          matchId,
          success,
          message: success
            ? "Simulation started"
            : "Failed to start simulation",
        });
      }
    );

    // Request to pause simulation
    socket.on("pause-simulation", (matchId: string) => {
      const success = simulationManager.pauseSimulation(matchId);
      socket.emit("simulation-response", {
        action: "pause",
        matchId,
        success,
        message: success ? "Simulation paused" : "Failed to pause simulation",
      });
    });

    // Request to resume simulation
    socket.on("resume-simulation", (matchId: string) => {
      const success = simulationManager.resumeSimulation(matchId);
      socket.emit("simulation-response", {
        action: "resume",
        matchId,
        success,
        message: success ? "Simulation resumed" : "Failed to resume simulation",
      });
    });

    // Request to reset simulation
    socket.on("reset-simulation", (matchId: string) => {
      const success = simulationManager.resetSimulation(matchId);
      socket.emit("simulation-response", {
        action: "reset",
        matchId,
        success,
        message: success ? "Simulation reset" : "Failed to reset simulation",
      });
    });

    // Request to stop simulation
    socket.on("stop-simulation", (matchId: string) => {
      const success = simulationManager.stopSimulation(matchId);
      socket.emit("simulation-response", {
        action: "stop",
        matchId,
        success,
        message: success ? "Simulation stopped" : "Failed to stop simulation",
      });
    });

    // Poll: Vote on an option
    socket.on(
      "vote-poll",
      (data: { matchId: string; userId: string; optionId: string }) => {
        const { matchId, userId, optionId } = data;

        console.log(
          `📊 User ${userId} attempting to vote for option ${optionId} in match ${matchId}`
        );

        const result = pollManager.vote(matchId, userId, optionId);

        // Send response to the voting user
        socket.emit("vote-poll-response", {
          success: result.success,
          message: result.message,
          poll: result.poll,
          hasVoted: result.success,
          userVote: result.success ? optionId : null,
        });

        if (result.success) {
          console.log(`✅ Vote recorded successfully for user ${userId}`);
        } else {
          console.log(`❌ Vote failed for user ${userId}: ${result.message}`);
        }
      }
    );

    // Poll: Get poll for a match
    socket.on("get-poll", (matchId: string) => {
      const poll = pollManager.getPoll(matchId);
      if (poll) {
        socket.emit("poll-data", poll);
      } else {
        socket.emit("poll-data", null);
      }
    });

    // Poll: Check if user has voted
    socket.on(
      "check-vote-status",
      (data: { matchId: string; userId: string }) => {
        const { matchId, userId } = data;
        const hasVoted = pollManager.hasUserVoted(matchId, userId);
        const userVote = pollManager.getUserVote(matchId, userId);

        socket.emit("vote-status", {
          hasVoted,
          userVote,
        });
      }
    );
  });
};

// Export managers for use in other parts of the application
export const getSimulationManager = () => simulationManager;
export const getPollManager = () => pollManager;
