import type { MatchEvent } from "@/types";

export const teamAEvents: MatchEvent[] = [
  {
    minute: 0,
    type: "kickoff",
    team: "teamA",
    description: "Manchester United kick off the match!",
  },
  {
    minute: 3,
    type: "shot",
    team: "teamA",
    player: "Marcus Rashford",
    description:
      "Rashford with an early shot from outside the box, just wide of the post!",
    metadata: { distance: "25 yards", shotType: "long-range" },
  },
  {
    minute: 12,
    type: "corner",
    team: "teamA",
    description: "Corner kick for Manchester United after a deflected shot",
  },
  {
    minute: 15,
    type: "goal",
    team: "teamA",
    player: "Bruno Fernandes",
    description: "GOAL! Bruno Fernandes scores with a brilliant free-kick!",
    metadata: {
      assist: "None",
      goalType: "free-kick",
      position: "edge of box",
    },
  },
  {
    minute: 23,
    type: "yellow-card",
    team: "teamA",
    player: "Casemiro",
    description: "Yellow card for Casemiro after a late tackle",
    metadata: { reason: "late tackle", severity: "moderate" },
  },
  {
    minute: 31,
    type: "shot",
    team: "teamA",
    player: "Antony",
    description: "Antony cuts inside and fires a shot, saved by the goalkeeper",
    metadata: { shotType: "left-footed", saved: true },
  },
  {
    minute: 45,
    type: "half-time",
    team: "teamA",
    description: "Half-time whistle! Manchester United lead 1-0",
  },
  {
    minute: 47,
    type: "substitution",
    team: "teamA",
    player: "Jadon Sancho",
    description: "Substitution: Sancho comes on for Antony",
    metadata: { playerOut: "Antony", reason: "tactical" },
  },
  {
    minute: 58,
    type: "shot",
    team: "teamA",
    player: "Marcus Rashford",
    description: "Rashford with another attempt, this time from close range",
    metadata: { shotType: "close-range", saved: true },
  },
  {
    minute: 67,
    type: "free-kick",
    team: "teamA",
    player: "Bruno Fernandes",
    description: "Free-kick in a dangerous position for Manchester United",
    metadata: { distance: "20 yards", position: "central" },
  },
  {
    minute: 72,
    type: "goal",
    team: "teamA",
    player: "Marcus Rashford",
    description: "GOAL! Rashford doubles the lead with a clinical finish!",
    metadata: {
      assist: "Jadon Sancho",
      goalType: "open play",
      position: "6-yard box",
    },
  },
  {
    minute: 89,
    type: "substitution",
    team: "teamA",
    player: "Fred",
    description: "Substitution: Fred comes on for Casemiro",
    metadata: { playerOut: "Casemiro", reason: "tactical" },
  },
];

export const teamBEvents: MatchEvent[] = [
  {
    minute: 0,
    type: "kickoff",
    team: "teamB",
    description: "Liverpool kick off the match!",
  },
  {
    minute: 7,
    type: "shot",
    team: "teamB",
    player: "Mohamed Salah",
    description: "Salah with Liverpool's first shot, comfortably saved",
    metadata: { shotType: "right-footed", saved: true },
  },
  {
    minute: 18,
    type: "yellow-card",
    team: "teamB",
    player: "Virgil van Dijk",
    description: "Yellow card for van Dijk after a professional foul",
    metadata: { reason: "professional foul", severity: "minor" },
  },
  {
    minute: 25,
    type: "shot",
    team: "teamB",
    player: "Darwin Núñez",
    description: "Núñez with a powerful header, just over the crossbar!",
    metadata: { shotType: "header", distance: "8 yards" },
  },
  {
    minute: 35,
    type: "corner",
    team: "teamB",
    description: "Corner kick for Liverpool after a deflected cross",
  },
  {
    minute: 45,
    type: "half-time",
    team: "teamB",
    description: "Half-time whistle! Liverpool trail 0-1",
  },
  {
    minute: 51,
    type: "shot",
    team: "teamB",
    player: "Luis Díaz",
    description: "Díaz with a curling effort, just wide of the far post",
    metadata: { shotType: "curling", distance: "18 yards" },
  },
  {
    minute: 63,
    type: "substitution",
    team: "teamB",
    player: "Roberto Firmino",
    description: "Substitution: Firmino comes on for Núñez",
    metadata: { playerOut: "Darwin Núñez", reason: "tactical" },
  },
  {
    minute: 75,
    type: "red-card",
    team: "teamB",
    player: "Fabinho",
    description: "RED CARD! Fabinho sent off for a second yellow card!",
    metadata: { reason: "second yellow", previousCards: 1 },
  },
  {
    minute: 82,
    type: "shot",
    team: "teamB",
    player: "Mohamed Salah",
    description: "Salah with a free-kick attempt, saved by the goalkeeper",
    metadata: { shotType: "free-kick", saved: true, distance: "25 yards" },
  },
  {
    minute: 87,
    type: "substitution",
    team: "teamB",
    player: "Harvey Elliott",
    description: "Substitution: Elliott comes on for Henderson",
    metadata: { playerOut: "Jordan Henderson", reason: "tactical" },
  },
];

export const generalEvents: MatchEvent[] = [
  {
    minute: 0,
    type: "commentary",
    description:
      "Welcome to Old Trafford for this Premier League clash between Manchester United and Liverpool!",
  },
  {
    minute: 5,
    type: "commentary",
    description:
      "Both teams looking to establish early dominance in this crucial fixture",
  },
  {
    minute: 15,
    type: "commentary",
    description:
      "What a strike! Bruno Fernandes with a moment of magic to give United the lead!",
  },
  {
    minute: 30,
    type: "commentary",
    description:
      "Liverpool struggling to create clear chances, United looking comfortable",
  },
  {
    minute: 45,
    type: "commentary",
    description:
      "Half-time: Manchester United 1-0 Liverpool. United have been the better side so far.",
  },
  {
    minute: 50,
    type: "commentary",
    description:
      "Second half underway, Liverpool need to find a way back into this match",
  },
  {
    minute: 60,
    type: "commentary",
    description:
      "Liverpool down to 10 men after Fabinho's dismissal, this is going to be tough",
  },
  {
    minute: 72,
    type: "commentary",
    description:
      "Another goal for United! Rashford makes it 2-0, Liverpool's hopes fading",
  },
  {
    minute: 85,
    type: "commentary",
    description:
      "Liverpool pushing forward but struggling to break down United's defense",
  },
  {
    minute: 90,
    type: "full-time",
    description:
      "Full-time: Manchester United 2-0 Liverpool. A dominant performance from the home side!",
  },
];

export const matchEvents: MatchEvent[] = [
  ...teamAEvents,
  ...teamBEvents,
  ...generalEvents,
].sort((a, b) => a.minute - b.minute);
