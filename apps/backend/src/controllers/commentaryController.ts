import { ApiResponse, PaginatedResponse } from "@repo/shared-types";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// GET /api/v1/commentary - Get all commentary
export const getAllCommentary = async (req: Request, res: Response) => {
  try {
    const { matchId, limit = "50", offset = "0" } = req.query;

    const where = matchId ? { matchId: matchId as string } : {};

    const commentary = await prisma.commentary.findMany({
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
      },
      orderBy: { timestamp: "desc" },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.commentary.count({ where });

    const response: PaginatedResponse = {
      status: "success",
      data: commentary,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: parseInt(offset as string) + commentary.length < total,
      },
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching commentary:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to fetch commentary",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

// GET /api/v1/commentary/:id - Get commentary by ID
export const getCommentaryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const commentary = await prisma.commentary.findUnique({
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
      },
    });

    if (!commentary) {
      const response: ApiResponse = {
        status: "error",
        message: "Commentary not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      status: "success",
      data: commentary,
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching commentary:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to fetch commentary",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

// POST /api/v1/commentary - Create new commentary
export const createCommentary = async (req: Request, res: Response) => {
  try {
    const { text, matchId, timestamp } = req.body;

    if (!text || !matchId) {
      const response: ApiResponse = {
        status: "error",
        message: "text and matchId are required",
      };
      return res.status(400).json(response);
    }

    // Verify match exists
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      const response: ApiResponse = {
        status: "error",
        message: "Match not found",
      };
      return res.status(404).json(response);
    }

    const commentary = await prisma.commentary.create({
      data: {
        text,
        matchId,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
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
      },
    });

    const response: ApiResponse = {
      status: "success",
      data: commentary,
    };
    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating commentary:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to create commentary",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

// PUT /api/v1/commentary/:id - Update commentary
export const updateCommentary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text, timestamp } = req.body;

    const existingCommentary = await prisma.commentary.findUnique({
      where: { id },
    });

    if (!existingCommentary) {
      const response: ApiResponse = {
        status: "error",
        message: "Commentary not found",
      };
      return res.status(404).json(response);
    }

    const updateData: any = {};
    if (text !== undefined) updateData.text = text;
    if (timestamp !== undefined) updateData.timestamp = new Date(timestamp);

    const commentary = await prisma.commentary.update({
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
      },
    });

    const response: ApiResponse = {
      status: "success",
      data: commentary,
    };
    res.json(response);
  } catch (error) {
    console.error("Error updating commentary:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to update commentary",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

// DELETE /api/v1/commentary/:id - Delete commentary
export const deleteCommentary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingCommentary = await prisma.commentary.findUnique({
      where: { id },
    });

    if (!existingCommentary) {
      const response: ApiResponse = {
        status: "error",
        message: "Commentary not found",
      };
      return res.status(404).json(response);
    }

    await prisma.commentary.delete({
      where: { id },
    });

    const response: ApiResponse = {
      status: "success",
      message: "Commentary deleted successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Error deleting commentary:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to delete commentary",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

// GET /api/v1/commentary/match/:matchId - Get commentary for specific match
export const getCommentaryByMatch = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const { limit = "50", offset = "0" } = req.query;

    // Verify match exists
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      const response: ApiResponse = {
        status: "error",
        message: "Match not found",
      };
      return res.status(404).json(response);
    }

    const commentary = await prisma.commentary.findMany({
      where: { matchId },
      orderBy: { timestamp: "asc" }, // Chronological order for live commentary
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.commentary.count({ where: { matchId } });

    const response: PaginatedResponse = {
      status: "success",
      data: commentary,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: parseInt(offset as string) + commentary.length < total,
      },
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching match commentary:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to fetch match commentary",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};
