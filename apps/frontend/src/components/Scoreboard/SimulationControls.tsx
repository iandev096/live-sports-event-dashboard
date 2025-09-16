import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useEffect, useMemo } from "react";
import { api } from "../../data/client";
import { useActiveMatch } from "../../state/activeMatch";

type ApiResponse<T> = { status: string; data?: T; message?: string };

export function SimulationControls() {
  const qc = useQueryClient();
  const { active, setActive } = useActiveMatch();

  const { data: liveMatch } = useQuery({
    queryKey: ["live-match-full"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<any[]>>("/matches/live");
      return res.data?.[0];
    },
    refetchInterval: 15000,
  });

  const matchId: string | undefined = active.id ?? liveMatch?.id;
  const teamA = useMemo(
    () => active.teamA ?? liveMatch?.teamA ?? "Team A",
    [active.teamA, liveMatch?.teamA]
  );
  const teamB = useMemo(
    () => active.teamB ?? liveMatch?.teamB ?? "Team B",
    [active.teamB, liveMatch?.teamB]
  );

  const enableManual = !liveMatch?.id;

  // Use existing timeline file for demo
  const DEMO_MATCH_ID = "manchester-united-vs-liverpool";

  // Set default active match ID for manual simulation
  useEffect(() => {
    if (!active.id && !liveMatch?.id) {
      setActive({ id: DEMO_MATCH_ID, teamA: "Team A", teamB: "Team B" });
    }
  }, [active.id, liveMatch?.id, setActive]);

  const startMutation = useMutation({
    mutationFn: async () => {
      if (!matchId) throw new Error("No live match available");
      return api.post<ApiResponse<any>>(`/simulations/${matchId}/start`, {
        teamA,
        teamB,
        config: { timeMultiplier: 60, autoStart: true, maxDuration: 90 },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["live-match"] });
    },
  });

  const stopMutation = useMutation({
    mutationFn: async () => {
      if (!matchId) throw new Error("No live match available");
      return api.post<ApiResponse<any>>(`/simulations/${matchId}/stop`, {});
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["live-match"] });
    },
  });

  const statusQuery = useQuery({
    queryKey: ["simulation-status", matchId],
    enabled: !!matchId,
    queryFn: async () => {
      if (!matchId) return null;
      return api.get<ApiResponse<any>>(`/simulations/${matchId}`);
    },
    refetchInterval: 5000,
  });

  return (
    <div className="flex items-center gap-2">
      {enableManual && (
        <>
          <input
            placeholder="Team A"
            value={teamA}
            onChange={(e) =>
              setActive({
                id: DEMO_MATCH_ID,
                teamA: e.target.value,
                teamB,
              })
            }
            className="w-28 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs outline-none"
          />
          <input
            placeholder="Team B"
            value={teamB}
            onChange={(e) =>
              setActive({
                id: DEMO_MATCH_ID,
                teamA,
                teamB: e.target.value,
              })
            }
            className="w-28 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs outline-none"
          />
        </>
      )}
      <button
        disabled={!matchId || startMutation.isPending}
        onClick={() => startMutation.mutate()}
        className={clsx(
          "rounded-md bg-[var(--color-success)] px-3 py-1.5 text-xs font-semibold text-white",
          "transition hover:brightness-110 active:scale-[0.98]",
          (!matchId || startMutation.isPending) &&
            "opacity-50 cursor-not-allowed"
        )}
        title={matchId ? `Start ${teamA} vs ${teamB}` : "No match selected"}
      >
        Start
      </button>
      <button
        disabled={!matchId || stopMutation.isPending}
        onClick={() => stopMutation.mutate()}
        className={clsx(
          "rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white",
          "transition hover:brightness-110 active:scale-[0.98]",
          (!matchId || stopMutation.isPending) &&
            "opacity-50 cursor-not-allowed"
        )}
        title={matchId ? `Stop ${teamA} vs ${teamB}` : "No live match"}
      >
        Stop
      </button>
      {statusQuery.data && (
        <div className="text-xs text-[--color-textSecondary]">
          Status: {statusQuery.data.data?.status || "unknown"}
        </div>
      )}
    </div>
  );
}
