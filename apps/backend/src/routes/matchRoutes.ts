import { Router } from "express";
import {
  createMatch,
  deleteMatch,
  getAllMatches,
  getLiveMatches,
  getMatchById,
  updateMatch,
} from "../controllers/matchController";

const router: Router = Router();

// GET /api/matches - Get all matches
router.get("/", getAllMatches);

// GET /api/matches/live - Get live matches
router.get("/live", getLiveMatches);

// GET /api/matches/:id - Get match by ID
router.get("/:id", getMatchById);

// POST /api/matches - Create new match
router.post("/", createMatch);

// PUT /api/matches/:id - Update match
router.put("/:id", updateMatch);

// DELETE /api/matches/:id - Delete match
router.delete("/:id", deleteMatch);

export default router;
