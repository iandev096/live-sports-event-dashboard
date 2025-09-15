import { Server } from "socket.io";
import { SimulationManager } from "../services";

// Global simulation manager instance
let simulationManager: SimulationManager;

export const setupSocket = (io: Server) => {
  // Initialize simulation manager
  simulationManager = new SimulationManager(io);

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    // Join match room for live updates
    socket.on("join-match", (matchId: string) => {
      socket.join(`match-${matchId}`);
      console.log(`User ${socket.id} joined match ${matchId}`);

      // Send current match state if simulation is running
      const matchState = simulationManager.getMatchState(matchId);
      if (matchState) {
        socket.emit("simulation-event", {
          type: "match-state",
          matchId,
          state: matchState,
        });
      }
    });

    // Leave match room
    socket.on("leave-match", (matchId: string) => {
      socket.leave(`match-${matchId}`);
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
  });
};

// Export simulation manager for use in other parts of the application
export const getSimulationManager = () => simulationManager;
