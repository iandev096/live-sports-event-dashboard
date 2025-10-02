import { Poll, UserVote } from "@repo/shared-types";
import { Server } from "socket.io";

export class PollManager {
  private polls: Map<string, Poll> = new Map(); // matchId -> Poll
  private votes: Map<string, Map<string, UserVote>> = new Map(); // matchId -> userId -> UserVote
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  /**
   * Create a poll for a match when simulation starts
   */
  public createPoll(matchId: string, teamA: string, teamB: string): Poll {
    // Check if poll already exists
    if (this.polls.has(matchId)) {
      console.log(`Poll for match ${matchId} already exists`);
      return this.polls.get(matchId)!;
    }

    const poll: Poll = {
      id: `poll-${matchId}`,
      matchId,
      question: "Who will win this match?",
      isActive: true,
      totalVotes: 0,
      createdAt: new Date().toISOString(),
      options: [
        {
          id: `option-${matchId}-1`,
          text: teamA,
          votes: [],
          voteCount: 0,
        },
        {
          id: `option-${matchId}-2`,
          text: teamB,
          votes: [],
          voteCount: 0,
        },
        {
          id: `option-${matchId}-3`,
          text: "Draw",
          votes: [],
          voteCount: 0,
        },
      ],
    };

    this.polls.set(matchId, poll);
    this.votes.set(matchId, new Map());

    console.log(`✅ Created poll for match ${matchId}: ${teamA} vs ${teamB}`);

    // Broadcast poll creation to all users in the match room
    this.io.to(matchId).emit("poll-created", poll);

    return poll;
  }

  /**
   * Vote on a poll option
   */
  public vote(
    matchId: string,
    userId: string,
    optionId: string
  ): { success: boolean; message: string; poll?: Poll } {
    const poll = this.polls.get(matchId);
    if (!poll) {
      return { success: false, message: "Poll not found" };
    }

    if (!poll.isActive) {
      return { success: false, message: "Poll is no longer active" };
    }

    // Check if user already voted (no vote changes allowed)
    const matchVotes = this.votes.get(matchId);
    if (matchVotes?.has(userId)) {
      return { success: false, message: "You have already voted" };
    }

    // Validate option exists
    const option = poll.options.find((opt) => opt.id === optionId);
    if (!option) {
      return { success: false, message: "Invalid option" };
    }

    // Record the vote
    const userVote: UserVote = {
      userId,
      optionId,
      votedAt: new Date().toISOString(),
    };

    matchVotes!.set(userId, userVote);

    // Update vote counts
    option.voteCount = (option.voteCount || 0) + 1;
    poll.totalVotes += 1;

    console.log(
      `✅ User ${userId} voted for "${option.text}" in match ${matchId}`
    );

    // Broadcast updated poll to all users in the match room
    this.io.to(matchId).emit("poll-updated", this.formatPollForFrontend(poll));

    return {
      success: true,
      message: "Vote recorded successfully",
      poll: this.formatPollForFrontend(poll),
    };
  }

  /**
   * Get poll for a match
   */
  public getPoll(matchId: string): Poll | null {
    const poll = this.polls.get(matchId);
    return poll ? this.formatPollForFrontend(poll) : null;
  }

  /**
   * Check if user has voted
   */
  public hasUserVoted(matchId: string, userId: string): boolean {
    const matchVotes = this.votes.get(matchId);
    return matchVotes?.has(userId) || false;
  }

  /**
   * Get user's vote
   */
  public getUserVote(matchId: string, userId: string): string | null {
    const matchVotes = this.votes.get(matchId);
    return matchVotes?.get(userId)?.optionId || null;
  }

  /**
   * End a poll when match ends
   */
  public endPoll(matchId: string): boolean {
    const poll = this.polls.get(matchId);
    if (!poll) {
      console.log(`❌ Poll for match ${matchId} not found`);
      return false;
    }

    poll.isActive = false;
    poll.endedAt = new Date().toISOString();

    console.log(`🏁 Ended poll for match ${matchId}`);

    // Broadcast poll ended to all users in the match room
    this.io.to(matchId).emit("poll-ended", this.formatPollForFrontend(poll));

    return true;
  }

  /**
   * Delete a poll (cleanup)
   */
  public deletePoll(matchId: string): boolean {
    const deleted = this.polls.delete(matchId);
    this.votes.delete(matchId);

    if (deleted) {
      console.log(`🗑️ Deleted poll for match ${matchId}`);
    }

    return deleted;
  }

  /**
   * Format poll for frontend (convert voteCount to votes array)
   */
  private formatPollForFrontend(poll: Poll): Poll {
    return {
      ...poll,
      options: poll.options.map((option) => ({
        ...option,
        votes: Array.from({ length: option.voteCount || 0 }, (_, i) => ({
          id: `vote-${option.id}-${i}`,
          createdAt: new Date().toISOString(),
        })),
      })),
    };
  }

  /**
   * Get all active polls (for debugging)
   */
  public getActivePolls(): Poll[] {
    return Array.from(this.polls.values())
      .filter((poll) => poll.isActive)
      .map((poll) => this.formatPollForFrontend(poll));
  }
}
