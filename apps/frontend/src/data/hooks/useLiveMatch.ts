import { useQuery } from "@tanstack/react-query";
import { api } from "../client";

type ApiResponse<T> = {
  status: "success" | "error";
  data?: T;
};

export interface LiveMatchDto {
  id: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  status: string;
  startTime?: string;
  isLive?: boolean;
  currentTime?: number;
}

export function useLiveMatch() {
  return useQuery({
    queryKey: ["live-match"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<LiveMatchDto[]>>("/matches/live");
      const first = res.data?.[0];
      if (!first) return undefined;
      // normalize shape for UI
      return {
        id: first.id,
        teamA: first.teamA,
        teamB: first.teamB,
        scoreA: first.scoreA ?? 0,
        scoreB: first.scoreB ?? 0,
        isLive: first.status === "LIVE" || first.isLive,
        currentTime: first.currentTime ?? 0,
      };
    },
    refetchInterval: 10_000,
  });
}
