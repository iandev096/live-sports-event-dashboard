import { Router } from "express";
import {
  deleteUserTimeline,
  getBaseTimeline,
  getUserTimeline,
  saveUserTimeline,
} from "../controllers/timelineController";

const router: Router = Router();

// Base timeline routes
router.get("/base/:matchId", getBaseTimeline);

// User timeline routes
router.get("/user/:matchId", getUserTimeline);
router.post("/user/:matchId", saveUserTimeline);
router.delete("/user/:matchId", deleteUserTimeline);

export default router;
