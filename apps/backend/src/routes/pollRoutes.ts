import { Router } from "express";
import {
  createPoll,
  deletePoll,
  getAllPolls,
  getPollById,
  getPollResults,
  updatePoll,
  voteOnPoll,
} from "../controllers/pollController";

const router: Router = Router();

// GET /api/polls - Get all polls
router.get("/", getAllPolls);

// GET /api/polls/:id - Get poll by ID
router.get("/:id", getPollById);

// GET /api/polls/:id/results - Get poll results
router.get("/:id/results", getPollResults);

// POST /api/polls - Create new poll
router.post("/", createPoll);

// POST /api/polls/:id/vote - Vote on poll
router.post("/:id/vote", voteOnPoll);

// PUT /api/polls/:id - Update poll
router.put("/:id", updatePoll);

// DELETE /api/polls/:id - Delete poll
router.delete("/:id", deletePoll);

export default router;
