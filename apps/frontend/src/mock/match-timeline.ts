import type { MatchTimeline } from "@/types";
import { matchEvents } from "./match-events";

export const mockMatchTimeline: MatchTimeline = {
  matchId: "man-united-vs-liverpool-2024-01-15",
  teamA: "Manchester United",
  teamB: "Liverpool",
  events: matchEvents,
  duration: 90, // 90 minutes match duration
};

export const mockMatchTimelineWithExtraTime: MatchTimeline = {
  matchId: "man-united-vs-liverpool-extra-time-2024-01-15",
  teamA: "Manchester United",
  teamB: "Liverpool",
  events: [
    ...matchEvents,
    // Extra time events
    {
      minute: 91,
      type: "commentary",
      description: "Extra time begins! Both teams looking for a winner",
    },
    {
      minute: 95,
      type: "shot",
      team: "teamA",
      player: "Marcus Rashford",
      description: "Rashford with a chance in extra time, just wide!",
      metadata: { shotType: "close-range", period: "extra-time" },
    },
    {
      minute: 102,
      type: "yellow-card",
      team: "teamB",
      player: "Trent Alexander-Arnold",
      description: "Yellow card for Alexander-Arnold in extra time",
      metadata: { reason: "time-wasting", period: "extra-time" },
    },
    {
      minute: 105,
      type: "extra-time",
      team: "teamA",
      description: "Half-time in extra time: Still 2-0 to Manchester United",
    },
    {
      minute: 110,
      type: "shot",
      team: "teamB",
      player: "Mohamed Salah",
      description: "Salah with a free-kick in extra time, saved!",
      metadata: { shotType: "free-kick", saved: true, period: "extra-time" },
    },
    {
      minute: 120,
      type: "full-time",
      description:
        "Full-time after extra time: Manchester United 2-0 Liverpool",
    },
  ],
  duration: 120, // 120 minutes including extra time
};

export const mockMatchTimelineWithPenalties: MatchTimeline = {
  matchId: "man-united-vs-liverpool-penalties-2024-01-15",
  teamA: "Manchester United",
  teamB: "Liverpool",
  events: [
    ...matchEvents,
    // Penalty shootout events
    {
      minute: 120,
      type: "full-time",
      description:
        "Full-time: 2-2 after extra time. Penalty shootout to decide!",
    },
    {
      minute: 121,
      type: "penalties",
      team: "teamA",
      player: "Bruno Fernandes",
      description: "Penalty 1: Fernandes scores! United 1-0",
      metadata: { penaltyNumber: 1, result: "scored" },
    },
    {
      minute: 121,
      type: "penalties",
      team: "teamB",
      player: "Mohamed Salah",
      description: "Penalty 1: Salah scores! Liverpool 1-1",
      metadata: { penaltyNumber: 1, result: "scored" },
    },
    {
      minute: 122,
      type: "penalties",
      team: "teamA",
      player: "Marcus Rashford",
      description: "Penalty 2: Rashford scores! United 2-1",
      metadata: { penaltyNumber: 2, result: "scored" },
    },
    {
      minute: 122,
      type: "penalties",
      team: "teamB",
      player: "Darwin Núñez",
      description: "Penalty 2: Núñez misses! Liverpool 1-2",
      metadata: { penaltyNumber: 2, result: "missed" },
    },
    {
      minute: 123,
      type: "penalties",
      team: "teamA",
      player: "Jadon Sancho",
      description: "Penalty 3: Sancho scores! United 3-1",
      metadata: { penaltyNumber: 3, result: "scored" },
    },
    {
      minute: 123,
      type: "penalties",
      team: "teamB",
      player: "Luis Díaz",
      description: "Penalty 3: Díaz scores! Liverpool 2-3",
      metadata: { penaltyNumber: 3, result: "scored" },
    },
    {
      minute: 124,
      type: "penalties",
      team: "teamA",
      player: "Fred",
      description: "Penalty 4: Fred scores! United 4-2",
      metadata: { penaltyNumber: 4, result: "scored" },
    },
    {
      minute: 124,
      type: "penalties",
      team: "teamB",
      player: "Roberto Firmino",
      description: "Penalty 4: Firmino scores! Liverpool 3-4",
      metadata: { penaltyNumber: 4, result: "scored" },
    },
    {
      minute: 125,
      type: "penalties",
      team: "teamA",
      player: "Casemiro",
      description: "Penalty 5: Casemiro scores! United win 5-3 on penalties!",
      metadata: { penaltyNumber: 5, result: "scored", winner: true },
    },
  ],
  duration: 125, // 120 minutes + penalty shootout
};

// Export all timeline variations
export const mockTimelines = {
  standard: mockMatchTimeline,
  extraTime: mockMatchTimelineWithExtraTime,
  penalties: mockMatchTimelineWithPenalties,
};
