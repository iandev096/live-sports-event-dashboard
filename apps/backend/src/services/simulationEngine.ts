import {
  MatchEvent,
  MatchState,
  MatchTimeline,
  ServerMatchEvent,
  SimulationConfig,
} from "@repo/shared-types";
import fs from "fs";
import path from "path";
import { Server } from "socket.io";

export class MatchSimulationEngine {
  private matchState: MatchState;
  private timeline: MatchTimeline;
  private config: SimulationConfig;
  private io: Server;
  private gameClockInterval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private processedEvents: Set<number> = new Set(); // Track processed events by minute
  private pastEvents: MatchEvent[] = []; // Store all past events for late joiners

  constructor(
    matchId: string,
    teamA: string,
    teamB: string,
    io: Server,
    config: SimulationConfig = {
      timeMultiplier: 60, // 1 minute per second for fast simulation
      autoStart: false,
      maxDuration: 90,
    }
  ) {
    this.io = io;
    this.config = config;

    // Initialize match state
    this.matchState = {
      matchId,
      teamA,
      teamB,
      scoreA: 0,
      scoreB: 0,
      currentTime: 0,
      phase: "pre-match",
      isLive: false,
    };

    // Load timeline
    this.timeline = this.loadTimeline(matchId);
  }

  /**
   * Load match timeline from JSON file
   */
  private loadTimeline(matchId: string): MatchTimeline {
    try {
      // Try to load specific match timeline
      const timelinePath = path.join(
        __dirname,
        "../data/timelines",
        `${matchId}.json`
      );
      const timelineData = fs.readFileSync(timelinePath, "utf-8");
      return JSON.parse(timelineData);
    } catch (error) {
      console.log(`No specific timeline for ${matchId}, trying default...`);

      // Try to load default timeline
      try {
        const defaultTimelinePath = path.join(
          __dirname,
          "../data/timelines",
          "manchester-united-vs-liverpool.json"
        );
        const timelineData = fs.readFileSync(defaultTimelinePath, "utf-8");
        const timeline = JSON.parse(timelineData);

        // Use the teams from the timeline, not the provided ones
        this.matchState.teamA = timeline.teamA;
        this.matchState.teamB = timeline.teamB;

        console.log(
          `✅ Loaded default timeline: ${timeline.teamA} vs ${timeline.teamB}`
        );
        return timeline;
      } catch (defaultError) {
        console.error(`Failed to load default timeline:`, defaultError);
        // Return empty timeline as final fallback
        return {
          matchId,
          teamA: this.matchState.teamA,
          teamB: this.matchState.teamB,
          events: [],
          duration: 90,
        };
      }
    }
  }

  /**
   * Start the match simulation
   */
  public startSimulation(): void {
    if (this.isRunning) {
      console.log(
        `Simulation for match ${this.matchState.matchId} is already running`
      );
      return;
    }

    console.log(
      `Starting simulation for ${this.matchState.teamA} vs ${this.matchState.teamB}`
    );

    this.matchState.isLive = true;
    this.matchState.startTime = new Date();
    this.matchState.phase = "first-half";
    this.processedEvents.clear();

    // Broadcast match start
    this.broadcastEvent({
      type: "match-start",
      matchId: this.matchState.matchId,
      teamA: this.matchState.teamA,
      teamB: this.matchState.teamB,
      startTime: this.matchState.startTime.toISOString(),
    });

    // Start game clock
    this.startGameClock();
  }

  /**
   * Pause the match simulation (can be resumed)
   */
  public pauseSimulation(): void {
    if (!this.isRunning) {
      console.log(
        `Simulation for match ${this.matchState.matchId} is not running`
      );
      return;
    }

    console.log(`Pausing simulation for match ${this.matchState.matchId}`);

    this.isRunning = false;
    this.matchState.isLive = false;

    if (this.gameClockInterval) {
      clearInterval(this.gameClockInterval);
      this.gameClockInterval = null;
    }

    // Broadcast pause state
    this.broadcastEvent({
      type: "match-state",
      matchId: this.matchState.matchId,
      state: this.matchState,
    });
  }

  /**
   * Resume the match simulation from paused state
   */
  public resumeSimulation(): void {
    if (this.isRunning) {
      console.log(
        `Simulation for match ${this.matchState.matchId} is already running`
      );
      return;
    }

    console.log(`Resuming simulation for match ${this.matchState.matchId}`);

    this.matchState.isLive = true;

    // Broadcast resume state
    this.broadcastEvent({
      type: "match-state",
      matchId: this.matchState.matchId,
      state: this.matchState,
    });

    // Restart game clock
    this.startGameClock();
  }

  /**
   * Stop the match simulation completely
   */
  public stopSimulation(): void {
    if (!this.isRunning) {
      console.log(
        `Simulation for match ${this.matchState.matchId} is not running`
      );
      return;
    }

    console.log(`Stopping simulation for match ${this.matchState.matchId}`);

    this.isRunning = false;
    this.matchState.isLive = false;
    this.matchState.endTime = new Date();
    this.matchState.phase = "full-time";

    if (this.gameClockInterval) {
      clearInterval(this.gameClockInterval);
      this.gameClockInterval = null;
    }

    // Broadcast final time update
    this.broadcastEvent({
      type: "time-update",
      matchId: this.matchState.matchId,
      currentTime: this.matchState.currentTime,
      phase: this.matchState.phase,
    });
  }

  /**
   * Reset the match simulation to initial state
   */
  public resetSimulation(): void {
    console.log(`Resetting simulation for match ${this.matchState.matchId}`);

    // Stop if running
    if (this.isRunning) {
      this.isRunning = false;
      if (this.gameClockInterval) {
        clearInterval(this.gameClockInterval);
        this.gameClockInterval = null;
      }
    }

    // Reset match state
    this.matchState.currentTime = 0;
    this.matchState.phase = "pre-match";
    this.matchState.scoreA = 0;
    this.matchState.scoreB = 0;
    this.matchState.isLive = false;
    this.matchState.startTime = new Date();
    this.matchState.endTime = undefined;

    // Clear processed events
    this.processedEvents.clear();

    // Broadcast reset state
    this.broadcastEvent({
      type: "match-state",
      matchId: this.matchState.matchId,
      state: this.matchState,
    });
  }

  /**
   * Start the game clock timer
   */
  private startGameClock(): void {
    this.isRunning = true;

    // Calculate interval based on time multiplier
    // If timeMultiplier is 60, we update every 1000ms (1 second) to simulate 1 minute
    const intervalMs = 1000 / this.config.timeMultiplier;

    this.gameClockInterval = setInterval(() => {
      this.updateGameClock();
    }, intervalMs);
  }

  /**
   * Update the game clock and process events
   */
  private updateGameClock(): void {
    if (!this.isRunning) return;

    // Increment game time
    this.matchState.currentTime += 1 / this.config.timeMultiplier;

    // Check if we've reached maximum duration
    if (this.matchState.currentTime >= this.config.maxDuration) {
      this.stopSimulation();
      return;
    }

    // Update match phase based on time
    this.updateMatchPhase();

    // Process events for current time
    this.processEventsForCurrentTime();

    // Broadcast time update every second (includes fractional time for seconds)
    this.broadcastEvent({
      type: "time-update",
      matchId: this.matchState.matchId,
      currentTime: this.matchState.currentTime, // Send full decimal time (e.g., 5.25 = 5min 15sec)
      phase: this.matchState.phase,
    });
  }

  /**
   * Update match phase based on current time
   */
  private updateMatchPhase(): void {
    const time = this.matchState.currentTime;

    if (time < 0) {
      this.matchState.phase = "pre-match";
    } else if (time < 45) {
      this.matchState.phase = "first-half";
    } else if (time < 46) {
      this.matchState.phase = "half-time";
    } else if (time < 90) {
      this.matchState.phase = "second-half";
    } else {
      this.matchState.phase = "full-time";
    }
  }

  /**
   * Process events that should occur at the current time
   */
  private processEventsForCurrentTime(): void {
    const currentMinute = Math.floor(this.matchState.currentTime);

    // Find events for current minute that haven't been processed
    const eventsToProcess = this.timeline.events.filter(
      (event) =>
        event.minute === currentMinute &&
        !this.processedEvents.has(event.minute)
    );

    eventsToProcess.forEach((event) => {
      this.processEvent(event);
      this.processedEvents.add(event.minute);
    });
  }

  /**
   * Process a single match event
   */
  private processEvent(event: MatchEvent): void {
    console.log(`[${event.minute}'] ${event.description}`);

    // Store event in past events for late joiners
    this.pastEvents.push(event);

    // Update match state based on event type
    switch (event.type) {
      case "goal":
        this.handleGoal(event);
        break;
      case "kickoff":
        this.handleKickoff(event);
        break;
      case "half-time":
        this.handleHalfTime(event);
        break;
      case "full-time":
        this.handleFullTime(event);
        break;
      case "commentary":
        this.handleCommentary(event);
        break;
      default:
        // For other events, just broadcast them
        this.broadcastEvent({
          type: "match-event",
          matchId: this.matchState.matchId,
          event,
        });
    }
  }

  /**
   * Handle goal events
   */
  private handleGoal(event: MatchEvent): void {
    if (event.team === "teamA") {
      this.matchState.scoreA++;
    } else if (event.team === "teamB") {
      this.matchState.scoreB++;
    }

    // Broadcast score update
    this.broadcastEvent({
      type: "score-update",
      matchId: this.matchState.matchId,
      teamA: this.matchState.scoreA,
      teamB: this.matchState.scoreB,
      scorer: event.player,
      minute: event.minute,
    });

    // Broadcast the event itself
    this.broadcastEvent({
      type: "match-event",
      matchId: this.matchState.matchId,
      event,
    });
  }

  /**
   * Handle kickoff events
   */
  private handleKickoff(event: MatchEvent): void {
    this.broadcastEvent({
      type: "match-event",
      matchId: this.matchState.matchId,
      event,
    });
  }

  /**
   * Handle half-time events
   */
  private handleHalfTime(event: MatchEvent): void {
    this.matchState.phase = "half-time";
    this.broadcastEvent({
      type: "match-event",
      matchId: this.matchState.matchId,
      event,
    });
  }

  /**
   * Handle full-time events
   */
  private handleFullTime(event: MatchEvent): void {
    this.matchState.phase = "full-time";
    this.stopSimulation();
    this.broadcastEvent({
      type: "match-event",
      matchId: this.matchState.matchId,
      event,
    });
  }

  /**
   * Handle commentary events
   */
  private handleCommentary(event: MatchEvent): void {
    this.broadcastEvent({
      type: "new-commentary",
      matchId: this.matchState.matchId,
      text: event.description,
      minute: event.minute,
      player: event.player,
    });
  }

  /**
   * Broadcast event to all connected clients in the match room
   */
  private broadcastEvent(event: ServerMatchEvent): void {
    // Use matchId directly as room name (no prefix)
    this.io.to(this.matchState.matchId).emit("simulation-event", event);
  }

  /**
   * Get current match state
   */
  public getMatchState(): MatchState {
    return { ...this.matchState };
  }

  /**
   * Check if simulation is running
   */
  public isSimulationRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Get match timeline
   */
  public getTimeline(): MatchTimeline {
    return { ...this.timeline };
  }

  /**
   * Get past events (for late joiners)
   */
  public getPastEvents(): MatchEvent[] {
    return [...this.pastEvents];
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    this.stopSimulation();
  }
}
