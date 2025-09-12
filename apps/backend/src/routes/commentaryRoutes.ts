import { Router } from "express";
import {
  createCommentary,
  deleteCommentary,
  getAllCommentary,
  getCommentaryById,
  getCommentaryByMatch,
  updateCommentary,
} from "../controllers/commentaryController";

const router: Router = Router();

// GET /api/commentary - Get all commentary
router.get("/", getAllCommentary);

// GET /api/commentary/match/:matchId - Get commentary for specific match
router.get("/match/:matchId", getCommentaryByMatch);

// GET /api/commentary/:id - Get commentary by ID
router.get("/:id", getCommentaryById);

// POST /api/commentary - Create new commentary
router.post("/", createCommentary);

// PUT /api/commentary/:id - Update commentary
router.put("/:id", updateCommentary);

// DELETE /api/commentary/:id - Delete commentary
router.delete("/:id", deleteCommentary);

export default router;
