import { type Poll } from "@repo/shared-types";

export const mockPoll: Poll = {
  id: "1",
  question: "Who will win the match?",
  isActive: true,
  totalVotes: 1247,
  options: [
    {
      id: "1",
      text: "Manchester United",
      votes: Array.from({ length: 523 }, (_, i) => ({
        id: `vote-${i}`,
        voterId: `voter-${i}`,
        createdAt: new Date().toISOString(),
      })),
    },
    {
      id: "2",
      text: "Liverpool",
      votes: Array.from({ length: 456 }, (_, i) => ({
        id: `vote-${i + 523}`,
        voterId: `voter-${i + 523}`,
        createdAt: new Date().toISOString(),
      })),
    },
    {
      id: "3",
      text: "Draw",
      votes: Array.from({ length: 268 }, (_, i) => ({
        id: `vote-${i + 979}`,
        voterId: `voter-${i + 979}`,
        createdAt: new Date().toISOString(),
      })),
    },
  ],
};

export const mockInactivePoll: Poll = {
  id: "2",
  question: "Who was the best player?",
  isActive: false,
  totalVotes: 892,
  options: [
    {
      id: "1",
      text: "Bruno Fernandes",
      votes: Array.from({ length: 445 }, (_, i) => ({
        id: `vote-${i}`,
        voterId: `voter-${i}`,
        createdAt: new Date().toISOString(),
      })),
    },
    {
      id: "2",
      text: "Marcus Rashford",
      votes: Array.from({ length: 312 }, (_, i) => ({
        id: `vote-${i + 445}`,
        voterId: `voter-${i + 445}`,
        createdAt: new Date().toISOString(),
      })),
    },
    {
      id: "3",
      text: "Casemiro",
      votes: Array.from({ length: 135 }, (_, i) => ({
        id: `vote-${i + 757}`,
        voterId: `voter-${i + 757}`,
        createdAt: new Date().toISOString(),
      })),
    },
  ],
};
