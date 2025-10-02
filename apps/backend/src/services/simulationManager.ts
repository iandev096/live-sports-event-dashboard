import { MatchState, SimulationConfig } from "@repo/shared-types";
import { Server } from "socket.io";
import { PollManager } from "./pollManager";
import { MatchSimulationEngine } from "./simulationEngine";

export class SimulationManager {
  private simulations: Map<string, MatchSimulationEngine> = new Map();
  private io: Server;
  private pollManager: PollManager;

  constructor(io: Server, pollManager: PollManager) {
    this.io = io;
    this.pollManager = pollManager;
  }

  /**
   * Start a simulation for a specific match
   */
  public startSimulation(
    matchId: string,
    teamA: string,
    teamB: string,
    config?: SimulationConfig
  ): boolean {
    // Check if simulation already exists
    if (this.simulations.has(matchId)) {
      console.log(`Simulation for match ${matchId} already exists`);
      return false;
    }

    try {
      // Create new simulation engine
      const simulation = new MatchSimulationEngine(
        matchId,
        teamA,
        teamB,
        this.io,
        config
      );

      // Store simulation
      this.simulations.set(matchId, simulation);

      // Start simulation
      simulation.startSimulation();

      // Create poll for the match
      this.pollManager.createPoll(matchId, teamA, teamB);

      console.log(
        `Started simulation for match ${matchId}: ${teamA} vs ${teamB}`
      );
      return true;
    } catch (error) {
      console.error(`Failed to start simulation for match ${matchId}:`, error);
      return false;
    }
  }

  /**
   * Pause a simulation for a specific match
   */
  public pauseSimulation(matchId: string): boolean {
    const simulation = this.simulations.get(matchId);

    if (!simulation) {
      console.log(`No simulation found for match ${matchId}`);
      return false;
    }

    try {
      simulation.pauseSimulation();
      console.log(`Paused simulation for match ${matchId}`);
      return true;
    } catch (error) {
      console.error(`Failed to pause simulation for match ${matchId}:`, error);
      return false;
    }
  }

  /**
   * Resume a simulation for a specific match
   */
  public resumeSimulation(matchId: string): boolean {
    const simulation = this.simulations.get(matchId);

    if (!simulation) {
      console.log(`No simulation found for match ${matchId}`);
      return false;
    }

    try {
      simulation.resumeSimulation();
      console.log(`Resumed simulation for match ${matchId}`);
      return true;
    } catch (error) {
      console.error(`Failed to resume simulation for match ${matchId}:`, error);
      return false;
    }
  }

  /**
   * Reset a simulation for a specific match (stops and removes it)
   */
  public resetSimulation(matchId: string): boolean {
    const simulation = this.simulations.get(matchId);

    if (!simulation) {
      console.log(`No simulation found for match ${matchId}`);
      return false;
    }

    try {
      // Stop the simulation completely
      simulation.stopSimulation();
      // Remove it from the map so it can be restarted fresh
      this.simulations.delete(matchId);
      // Delete the poll as well
      this.pollManager.deletePoll(matchId);
      console.log(
        `Reset (stopped and removed) simulation for match ${matchId}`
      );
      return true;
    } catch (error) {
      console.error(`Failed to reset simulation for match ${matchId}:`, error);
      return false;
    }
  }

  /**
   * Stop a simulation for a specific match
   */
  public stopSimulation(matchId: string): boolean {
    const simulation = this.simulations.get(matchId);

    if (!simulation) {
      console.log(`No simulation found for match ${matchId}`);
      return false;
    }

    try {
      simulation.stopSimulation();
      this.simulations.delete(matchId);
      // End the poll when match ends
      this.pollManager.endPoll(matchId);
      console.log(`Stopped simulation for match ${matchId}`);
      return true;
    } catch (error) {
      console.error(`Failed to stop simulation for match ${matchId}:`, error);
      return false;
    }
  }

  /**
   * Get simulation status for a match
   */
  public getSimulationStatus(matchId: string): {
    status: "not_found" | "running" | "stopped";
    matchId: string;
  } {
    const simulation = this.simulations.get(matchId);

    if (!simulation) {
      return { status: "not_found", matchId };
    }

    return {
      status: simulation.isSimulationRunning() ? "running" : "stopped",
      matchId,
    };
  }

  /**
   * Get match state for a running simulation
   */
  public getMatchState(matchId: string) {
    const simulation = this.simulations.get(matchId);

    if (!simulation) {
      return null;
    }

    return simulation.getMatchState();
  }

  /**
   * Get past events for a running simulation
   */
  public getPastEvents(matchId: string) {
    const simulation = this.simulations.get(matchId);

    if (!simulation) {
      return [];
    }

    return simulation.getPastEvents();
  }

  /**
   * Get all running simulations
   */
  public getAllSimulations(): Array<{ matchId: string; state: MatchState }> {
    const results: Array<{ matchId: string; state: any }> = [];

    this.simulations.forEach((simulation, matchId) => {
      results.push({
        matchId,
        state: simulation.getMatchState(),
      });
    });

    return results;
  }

  /**
   * Stop all simulations
   */
  public stopAllSimulations(): void {
    console.log(`Stopping all ${this.simulations.size} simulations`);

    this.simulations.forEach((simulation, matchId) => {
      try {
        simulation.stopSimulation();
        console.log(`Stopped simulation for match ${matchId}`);
      } catch (error) {
        console.error(`Error stopping simulation for match ${matchId}:`, error);
      }
    });

    this.simulations.clear();
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    this.stopAllSimulations();
  }
}
