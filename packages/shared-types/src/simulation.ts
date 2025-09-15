// Shared types for simulation events between frontend and backend
// This ensures type safety across the entire application

export interface MatchState {
  matchId: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  currentTime: number; // in minutes
  phase: MatchPhase;
  isLive: boolean;
  startTime?: Date;
  endTime?: Date;
}

export type MatchPhase =
  | "pre-match"
  | "first-half"
  | "half-time"
  | "second-half"
  | "full-time"
  | "extra-time"
  | "penalties";

export interface MatchEvent {
  minute: number;
  type: EventType;
  team?: "teamA" | "teamB";
  player?: string;
  description: string;
  metadata?: Record<string, any>;
}

export type EventType =
  | "kickoff"
  | "goal"
  | "yellow-card"
  | "red-card"
  | "substitution"
  | "shot"
  | "save"
  | "corner"
  | "free-kick"
  | "penalty"
  | "half-time"
  | "full-time"
  | "commentary";

export interface MatchTimeline {
  matchId: string;
  teamA: string;
  teamB: string;
  events: MatchEvent[];
  duration: number; // total match duration in minutes
}

export interface SimulationConfig {
  timeMultiplier: number; // 1 = real time, 60 = 1 minute per second
  autoStart: boolean;
  maxDuration: number; // maximum simulation duration in minutes
}

// ============================================================================
// WEBSOCKET EVENT TYPES - SHARED BETWEEN FRONTEND AND BACKEND
// ============================================================================

// Server → Client Events (Backend broadcasts these)
export interface MatchStartEvent {
  type: "match-start";
  matchId: string;
  teamA: string;
  teamB: string;
  startTime: string;
}

export interface TimeUpdateEvent {
  type: "time-update";
  matchId: string;
  currentTime: number;
  phase: MatchPhase;
}

export interface ScoreUpdateEvent {
  type: "score-update";
  matchId: string;
  teamA: number;
  teamB: number;
  scorer?: string;
  minute: number;
}

export interface CommentaryEvent {
  type: "new-commentary";
  matchId: string;
  text: string;
  minute: number;
  player?: string;
}

export interface MatchEventBroadcast {
  type: "match-event";
  matchId: string;
  event: MatchEvent;
}

export interface MatchStateEvent {
  type: "match-state";
  matchId: string;
  state: MatchState;
}

// Union type for all server events
export type ServerMatchEvent =
  | MatchStartEvent
  | TimeUpdateEvent
  | ScoreUpdateEvent
  | CommentaryEvent
  | MatchEventBroadcast
  | MatchStateEvent;

// ============================================================================
// CLIENT EVENT TYPES - FRONTEND TO BACKEND
// ============================================================================

export interface JoinMatchEvent {
  type: "join-match";
  matchId: string;
}

export interface LeaveMatchEvent {
  type: "leave-match";
  matchId: string;
}

export interface GetSimulationStatusEvent {
  type: "get-simulation-status";
  matchId: string;
}

export interface StartSimulationEvent {
  type: "start-simulation";
  matchId: string;
  teamA: string;
  teamB: string;
  config?: SimulationConfig;
}

export interface StopSimulationEvent {
  type: "stop-simulation";
  matchId: string;
}

// Union type for all client events
export type ClientMatchEvent =
  | JoinMatchEvent
  | LeaveMatchEvent
  | GetSimulationStatusEvent
  | StartSimulationEvent
  | StopSimulationEvent;

// ============================================================================
// API TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  status: "success" | "error";
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type TeamSide = "teamA" | "teamB";

export interface TeamInfo {
  name: string;
  score: number;
  side: TeamSide;
}

export interface MatchSummary {
  matchId: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  phase: MatchPhase;
  isLive: boolean;
  currentTime: number;
}
