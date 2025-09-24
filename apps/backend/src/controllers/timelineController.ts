import { ApiResponse } from "@repo/shared-types";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { prisma } from "../lib/prisma";

// GET /api/v1/timelines/base/:matchId - Get base timeline from JSON file
export const getBaseTimeline = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;

    // Load base timeline from JSON file
    const timelinePath = path.join(
      __dirname,
      "../data/timelines",
      `${matchId}.json`
    );

    if (!fs.existsSync(timelinePath)) {
      const response: ApiResponse = {
        status: "error",
        message: "Base timeline not found",
      };
      return res.status(404).json(response);
    }

    const timelineData = fs.readFileSync(timelinePath, "utf-8");
    const timeline = JSON.parse(timelineData);

    const response: ApiResponse = {
      status: "success",
      data: timeline,
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching base timeline:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to fetch base timeline",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

// GET /api/v1/timelines/user/:matchId - Get user's custom timeline
export const getUserTimeline = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      const response: ApiResponse = {
        status: "error",
        message: "userId is required",
      };
      return res.status(400).json(response);
    }

    const userTimeline = await prisma.userTimeline.findUnique({
      where: {
        userId_matchId: {
          userId: userId as string,
          matchId,
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
      },
    });

    if (!userTimeline) {
      const response: ApiResponse = {
        status: "error",
        message: "User timeline not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      status: "success",
      data: {
        ...(userTimeline.timelineData as any),
        id: userTimeline.id,
        userId: userTimeline.userId,
        matchId: userTimeline.matchId,
        createdAt: userTimeline.createdAt,
        updatedAt: userTimeline.updatedAt,
      },
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching user timeline:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to fetch user timeline",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

// POST /api/v1/timelines/user/:matchId - Save user's custom timeline
export const saveUserTimeline = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const { userId, timelineData } = req.body;

    if (!userId || !timelineData) {
      const response: ApiResponse = {
        status: "error",
        message: "userId and timelineData are required",
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

    // Upsert user timeline (create or update)
    const userTimeline = await prisma.userTimeline.upsert({
      where: {
        userId_matchId: {
          userId,
          matchId,
        },
      },
      update: {
        timelineData,
        updatedAt: new Date(),
      },
      create: {
        userId,
        matchId,
        timelineData,
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
      data: {
        ...(userTimeline.timelineData as any),
        id: userTimeline.id,
        userId: userTimeline.userId,
        matchId: userTimeline.matchId,
        createdAt: userTimeline.createdAt,
        updatedAt: userTimeline.updatedAt,
      },
    };
    res.json(response);
  } catch (error) {
    console.error("Error saving user timeline:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to save user timeline",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

// DELETE /api/v1/timelines/user/:matchId - Delete user's custom timeline
export const deleteUserTimeline = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      const response: ApiResponse = {
        status: "error",
        message: "userId is required",
      };
      return res.status(400).json(response);
    }

    const userTimeline = await prisma.userTimeline.findUnique({
      where: {
        userId_matchId: {
          userId: userId as string,
          matchId,
        },
      },
    });

    if (!userTimeline) {
      const response: ApiResponse = {
        status: "error",
        message: "User timeline not found",
      };
      return res.status(404).json(response);
    }

    await prisma.userTimeline.delete({
      where: {
        userId_matchId: {
          userId: userId as string,
          matchId,
        },
      },
    });

    const response: ApiResponse = {
      status: "success",
      message: "User timeline deleted successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Error deleting user timeline:", error);
    const response: ApiResponse = {
      status: "error",
      message: "Failed to delete user timeline",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};
