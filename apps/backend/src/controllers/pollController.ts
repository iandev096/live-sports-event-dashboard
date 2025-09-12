import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// GET /api/polls - Get all polls
export const getAllPolls = async (req: Request, res: Response) => {
  try {
    const { matchId, isActive, limit = "10", offset = "0" } = req.query;

    const where: any = {};
    if (matchId) where.matchId = matchId as string;
    if (isActive !== undefined) where.isActive = isActive === "true";

    const polls = await prisma.poll.findMany({
      where,
      include: {
        match: {
          select: {
            id: true,
            teamA: true,
            teamB: true,
            status: true,
            startTime: true,
          },
        },
        options: {
          include: {
            votes: true,
          },
        },
        votes: true,
      },
      orderBy: { createdAt: "desc" },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.poll.count({ where });

    res.json({
      status: "success",
      data: polls,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: parseInt(offset as string) + polls.length < total,
      },
    });
  } catch (error) {
    console.error("Error fetching polls:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch polls",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// GET /api/polls/:id - Get poll by ID
export const getPollById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        match: {
          select: {
            id: true,
            teamA: true,
            teamB: true,
            status: true,
            startTime: true,
          },
        },
        options: {
          include: {
            votes: true,
          },
        },
        votes: true,
      },
    });

    if (!poll) {
      return res.status(404).json({
        status: "error",
        message: "Poll not found",
      });
    }

    res.json({
      status: "success",
      data: poll,
    });
  } catch (error) {
    console.error("Error fetching poll:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch poll",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// POST /api/polls - Create new poll
export const createPoll = async (req: Request, res: Response) => {
  try {
    const { question, matchId, options } = req.body;

    if (
      !question ||
      !matchId ||
      !options ||
      !Array.isArray(options) ||
      options.length < 2
    ) {
      return res.status(400).json({
        status: "error",
        message: "question, matchId, and at least 2 options are required",
      });
    }

    // Verify match exists
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return res.status(404).json({
        status: "error",
        message: "Match not found",
      });
    }

    const poll = await prisma.poll.create({
      data: {
        question,
        matchId,
        options: {
          create: options.map((option: { text: string }) => ({
            text: option.text,
          })),
        },
      },
      include: {
        match: {
          select: {
            id: true,
            teamA: true,
            teamB: true,
            status: true,
            startTime: true,
          },
        },
        options: {
          include: {
            votes: true,
          },
        },
        votes: true,
      },
    });

    res.status(201).json({
      status: "success",
      data: poll,
    });
  } catch (error) {
    console.error("Error creating poll:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create poll",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// PUT /api/polls/:id - Update poll
export const updatePoll = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { question, isActive } = req.body;

    const existingPoll = await prisma.poll.findUnique({
      where: { id },
    });

    if (!existingPoll) {
      return res.status(404).json({
        status: "error",
        message: "Poll not found",
      });
    }

    const updateData: any = {};
    if (question !== undefined) updateData.question = question;
    if (isActive !== undefined) updateData.isActive = isActive;

    const poll = await prisma.poll.update({
      where: { id },
      data: updateData,
      include: {
        match: {
          select: {
            id: true,
            teamA: true,
            teamB: true,
            status: true,
            startTime: true,
          },
        },
        options: {
          include: {
            votes: true,
          },
        },
        votes: true,
      },
    });

    res.json({
      status: "success",
      data: poll,
    });
  } catch (error) {
    console.error("Error updating poll:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update poll",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// DELETE /api/polls/:id - Delete poll
export const deletePoll = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingPoll = await prisma.poll.findUnique({
      where: { id },
    });

    if (!existingPoll) {
      return res.status(404).json({
        status: "error",
        message: "Poll not found",
      });
    }

    await prisma.poll.delete({
      where: { id },
    });

    res.json({
      status: "success",
      message: "Poll deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting poll:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete poll",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// POST /api/polls/:id/vote - Vote on poll
export const voteOnPoll = async (req: Request, res: Response) => {
  try {
    const { id: pollId } = req.params;
    const { optionId, voterId } = req.body;

    if (!optionId) {
      return res.status(400).json({
        status: "error",
        message: "optionId is required",
      });
    }

    // Verify poll exists and is active
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: true },
    });

    if (!poll) {
      return res.status(404).json({
        status: "error",
        message: "Poll not found",
      });
    }

    if (!poll.isActive) {
      return res.status(400).json({
        status: "error",
        message: "Poll is not active",
      });
    }

    // Verify option belongs to poll
    const option = poll.options.find((opt) => opt.id === optionId);
    if (!option) {
      return res.status(400).json({
        status: "error",
        message: "Invalid option for this poll",
      });
    }

    // Check for existing vote from same voter (if voterId provided)
    if (voterId) {
      const existingVote = await prisma.vote.findUnique({
        where: {
          pollId_voterId: {
            pollId,
            voterId,
          },
        },
      });

      if (existingVote) {
        return res.status(400).json({
          status: "error",
          message: "You have already voted on this poll",
        });
      }
    }

    const vote = await prisma.vote.create({
      data: {
        pollId,
        optionId,
        voterId: voterId || null,
      },
      include: {
        option: true,
      },
    });

    res.status(201).json({
      status: "success",
      data: vote,
    });
  } catch (error) {
    console.error("Error voting on poll:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to vote on poll",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// GET /api/polls/:id/results - Get poll results
export const getPollResults = async (req: Request, res: Response) => {
  try {
    const { id: pollId } = req.params;

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          include: {
            votes: true,
          },
        },
      },
    });

    if (!poll) {
      return res.status(404).json({
        status: "error",
        message: "Poll not found",
      });
    }

    const results = poll.options.map((option) => ({
      id: option.id,
      text: option.text,
      voteCount: option.votes.length,
      percentage:
        poll.options.reduce((total, opt) => total + opt.votes.length, 0) > 0
          ? Math.round(
              (option.votes.length /
                poll.options.reduce(
                  (total, opt) => total + opt.votes.length,
                  0
                )) *
                100
            )
          : 0,
    }));

    const totalVotes = poll.options.reduce(
      (total, option) => total + option.votes.length,
      0
    );

    res.json({
      status: "success",
      data: {
        poll: {
          id: poll.id,
          question: poll.question,
          isActive: poll.isActive,
          createdAt: poll.createdAt,
        },
        results,
        totalVotes,
      },
    });
  } catch (error) {
    console.error("Error fetching poll results:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch poll results",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
