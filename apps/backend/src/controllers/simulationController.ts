import { ApiResponse } from "@repo/shared-types";
import { Request, Response } from "express";
import { getSimulationManager } from "../socket/socketHandler";

// GET /api/v1/simulations - Get all running simulations
export const getAllSimulations = async (req: Request, res: Response) => {
  try {
    const simulationManager = getSimulationManager();
    const simulations = simulationManager.getAllSimulations();

    const response: ApiResponse = {
      status: "success",
      data: {
        simulations,
        count: simulations.length,
      },
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching simulations:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to fetch simulations",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

// GET /api/v1/simulations/:matchId - Get simulation status for a specific match
export const getSimulationStatus = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const simulationManager = getSimulationManager();

    const status = simulationManager.getSimulationStatus(matchId);
    const matchState = simulationManager.getMatchState(matchId);

    const response: ApiResponse = {
      status: "success",
      data: {
        ...status,
        matchState: matchState || null,
      },
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching simulation status:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to fetch simulation status",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

// POST /api/v1/simulations/:matchId/start - Start simulation for a match
export const startSimulation = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const { teamA, teamB, config } = req.body;

    // Validate required fields
    if (!teamA || !teamB) {
      const response: ApiResponse = {
        status: "error",
        message: "teamA and teamB are required",
      };
      return res.status(400).json(response);
    }

    const simulationManager = getSimulationManager();

    // Check if simulation already exists
    const simulationStatus = simulationManager.getSimulationStatus(matchId);
    if (simulationStatus.status !== "not_found") {
      const response: ApiResponse = {
        status: "error",
        message: "Simulation already exists for this match",
      };
      return res.status(409).json(response);
    }

    // Start simulation
    const success = simulationManager.startSimulation(
      matchId,
      teamA,
      teamB,
      config
    );

    if (success) {
      const response: ApiResponse = {
        status: "success",
        message: "Simulation started successfully",
        data: {
          matchId,
          teamA,
          teamB,
        },
      };
      res.json(response);
    } else {
      const response: ApiResponse = {
        status: "error",
        message: "Failed to start simulation",
      };
      res.status(500).json(response);
    }
  } catch (error) {
    console.error("Error starting simulation:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to start simulation",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

// POST /api/v1/simulations/:matchId/stop - Stop simulation for a match
export const stopSimulation = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const simulationManager = getSimulationManager();

    const success = simulationManager.stopSimulation(matchId);

    if (success) {
      const response: ApiResponse = {
        status: "success",
        message: "Simulation stopped successfully",
      };
      res.json(response);
    } else {
      const response: ApiResponse = {
        status: "error",
        message: "No simulation found for this match",
      };
      res.status(404).json(response);
    }
  } catch (error) {
    console.error("Error stopping simulation:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to stop simulation",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

// POST /api/v1/simulations/stop-all - Stop all running simulations
export const stopAllSimulations = async (req: Request, res: Response) => {
  try {
    const simulationManager = getSimulationManager();
    simulationManager.stopAllSimulations();

    const response: ApiResponse = {
      status: "success",
      message: "All simulations stopped successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Error stopping all simulations:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to stop all simulations",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

// GET /api/v1/simulations/:matchId/state - Get current match state
export const getMatchState = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const simulationManager = getSimulationManager();

    const matchState = simulationManager.getMatchState(matchId);

    if (!matchState) {
      const response: ApiResponse = {
        status: "error",
        message: "No simulation found for this match",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      status: "success",
      data: matchState,
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching match state:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to fetch match state",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};
