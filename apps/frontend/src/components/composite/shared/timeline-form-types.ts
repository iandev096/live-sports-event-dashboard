import type { EventType, MatchTimeline } from "@/types";
import * as z from "zod";

// Schemas
export const eventSchema = z.object({
  minute: z.number().min(0).max(120),
  type: z.enum([
    "kickoff",
    "goal",
    "yellow-card",
    "red-card",
    "substitution",
    "shot",
    "save",
    "corner",
    "free-kick",
    "penalty",
    "penalties",
    "half-time",
    "full-time",
    "extra-time",
    "commentary",
  ]),
  team: z.enum(["teamA", "teamB"]).optional(),
  player: z.string().optional(),
  description: z.string().min(1),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const timelineSchema = z.object({
  matchId: z.string(),
  teamA: z.string().min(1),
  teamB: z.string().min(1),
  matchType: z.enum(["standard", "extra-time", "penalties"]),
  events: z.array(eventSchema),
});

// Types
export type TimelineFormData = z.infer<typeof timelineSchema>;

export interface TimelineFormProps {
  initialTimeline?: MatchTimeline;
  onSave: (timeline: MatchTimeline) => void;
  onCancel: () => void;
}

// Constants
export const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "kickoff", label: "Kickoff" },
  { value: "goal", label: "Goal" },
  { value: "yellow-card", label: "Yellow Card" },
  { value: "red-card", label: "Red Card" },
  { value: "substitution", label: "Substitution" },
  { value: "shot", label: "Shot" },
  { value: "save", label: "Save" },
  { value: "corner", label: "Corner" },
  { value: "free-kick", label: "Free Kick" },
  { value: "penalty", label: "Penalty" },
  { value: "penalties", label: "Penalties" },
  { value: "half-time", label: "Half Time" },
  { value: "full-time", label: "Full Time" },
  { value: "extra-time", label: "Extra Time" },
  { value: "commentary", label: "Commentary" },
];

export const CONSTANT_EVENTS = {
  standard: ["kickoff", "half-time", "full-time"],
  "extra-time": ["kickoff", "half-time", "extra-time", "full-time"],
  penalties: ["kickoff", "half-time", "full-time", "penalties"],
};
