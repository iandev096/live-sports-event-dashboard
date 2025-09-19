// Poll-related types for the live sports event dashboard

export type Vote = {
  id: string;
  voterId?: string;
  createdAt: string;
};

export type PollOption = {
  id: string;
  text: string;
  votes: Vote[];
};

export type Poll = {
  id: string;
  question: string;
  isActive: boolean;
  options: PollOption[];
  totalVotes: number;
};
