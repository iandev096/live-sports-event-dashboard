import { MatchStatus } from "@prisma/client";
import { ApiResponse, PaginatedResponse } from "@repo/shared-types";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// GET /api/v1/matches - Get all matches
export const getAllMatches = async (req: Request, res: Response) => {
  try {
    const { status, limit = "10", offset = "0" } = req.query;

    const where = status ? { status: status as MatchStatus } : {};

    const matches = await prisma.match.findMany({
      where,
      include: {
        polls: {
          include: {
            options: {
              include: {
                votes: true,
              },
            },
          },
        },
      },
      orderBy: { startTime: "desc" },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.match.count({ where });

    const response: PaginatedResponse = {
      status: "success",
      data: matches,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: parseInt(offset as string) + matches.length < total,
      },
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching matches:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to fetch matches",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

// GET /api/v1/matches/:id - Get match by ID
export const getMatchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        polls: {
          include: {
            options: {
              include: {
                votes: true,
              },
            },
          },
        },
      },
    });

    if (!match) {
      const response: ApiResponse = {
        status: "error",
        message: "Match not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      status: "success",
      data: match,
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching match:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to fetch match",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

// POST /api/v1/matches - Create new match
export const createMatch = async (req: Request, res: Response) => {
  try {
    const { teamA, teamB, startTime, status = "SCHEDULED" } = req.body;

    if (!teamA || !teamB) {
      const response: ApiResponse = {
        status: "error",
        message: "teamA and teamB are required",
      };
      return res.status(400).json(response);
    }

    const match = await prisma.match.create({
      data: {
        teamA,
        teamB,
        startTime: startTime ? new Date(startTime) : null,
        status: status as MatchStatus,
      },
      include: {
        polls: true,
      },
    });

    const response: ApiResponse = {
      status: "success",
      data: match,
    };
    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating match:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to create match",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

// PUT /api/v1/matches/:id - Update match
export const updateMatch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { teamA, teamB, scoreA, scoreB, status, startTime, endTime } =
      req.body;

    const existingMatch = await prisma.match.findUnique({
      where: { id },
    });

    if (!existingMatch) {
      const response: ApiResponse = {
        status: "error",
        message: "Match not found",
      };
      return res.status(404).json(response);
    }

    const updateData: any = {};
    if (teamA !== undefined) updateData.teamA = teamA;
    if (teamB !== undefined) updateData.teamB = teamB;
    if (scoreA !== undefined) updateData.scoreA = scoreA;
    if (scoreB !== undefined) updateData.scoreB = scoreB;
    if (status !== undefined) updateData.status = status as MatchStatus;
    if (startTime !== undefined)
      updateData.startTime = startTime ? new Date(startTime) : null;
    if (endTime !== undefined)
      updateData.endTime = endTime ? new Date(endTime) : null;

    const match = await prisma.match.update({
      where: { id },
      data: updateData,
      include: {
        polls: {
          include: {
            options: {
              include: {
                votes: true,
              },
            },
          },
        },
      },
    });

    const response: ApiResponse = {
      status: "success",
      data: match,
    };
    res.json(response);
  } catch (error) {
    console.error("Error updating match:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to update match",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

// DELETE /api/v1/matches/:id - Delete match
export const deleteMatch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingMatch = await prisma.match.findUnique({
      where: { id },
    });

    if (!existingMatch) {
      const response: ApiResponse = {
        status: "error",
        message: "Match not found",
      };
      return res.status(404).json(response);
    }

    await prisma.match.delete({
      where: { id },
    });

    const response: ApiResponse = {
      status: "success",
      message: "Match deleted successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Error deleting match:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to delete match",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

// GET /api/v1/matches/live - Get live matches
export const getLiveMatches = async (req: Request, res: Response) => {
  try {
    const matches = await prisma.match.findMany({
      where: { status: "LIVE" },
      include: {
        polls: {
          include: {
            options: {
              include: {
                votes: true,
              },
            },
          },
        },
      },
      orderBy: { startTime: "desc" },
    });

    const response: ApiResponse = {
      status: "success",
      data: matches,
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching live matches:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to fetch live matches",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};
