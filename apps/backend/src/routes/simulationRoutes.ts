import { Router } from "express";
import {
  getAllSimulations,
  getMatchState,
  getSimulationStatus,
  startSimulation,
  stopAllSimulations,
  stopSimulation,
} from "../controllers/simulationController";

const router: Router = Router();

// GET /api/v1/simulations - Get all running simulations
router.get("/", getAllSimulations);

// GET /api/v1/simulations/:matchId - Get simulation status
router.get("/:matchId", getSimulationStatus);

// GET /api/v1/simulations/:matchId/state - Get match state
router.get("/:matchId/state", getMatchState);

// POST /api/v1/simulations/:matchId/start - Start simulation
router.post("/:matchId/start", startSimulation);

// POST /api/v1/simulations/:matchId/stop - Stop simulation
router.post("/:matchId/stop", stopSimulation);

// POST /api/v1/simulations/stop-all - Stop all simulations
router.post("/stop-all", stopAllSimulations);

export default router;
