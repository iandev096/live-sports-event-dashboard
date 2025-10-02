// Poll-related types for the live sports event dashboard

export type Vote = {
  id: string;
  voterId?: string;
  createdAt: string;
};

export type PollOption = {
  id: string;
  text: string;
  votes: Vote[]; // Keep for frontend compatibility
  voteCount?: number; // Simplified count for backend
};

export type Poll = {
  id: string;
  matchId: string; // Tie poll to a specific match
  question: string;
  isActive: boolean;
  options: PollOption[];
  totalVotes: number;
  createdAt?: string;
  endedAt?: string;
};

// Backend-only simplified vote tracking
export type UserVote = {
  userId: string;
  optionId: string;
  votedAt: string;
};
