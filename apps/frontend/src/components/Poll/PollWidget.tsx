import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../data/client";

type ApiResponse<T> = { status: string; data: T };

type PollOption = { id: string; text: string; votes?: any[] };
type Poll = {
  id: string;
  question: string;
  isActive: boolean;
  options: PollOption[];
};

export function PollWidget() {
  const qc = useQueryClient();
  const { data: matchId } = useQuery({
    queryKey: ["live-match-id"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<any[]>>("/matches/live");
      return res.data?.[0]?.id as string | undefined;
    },
    refetchInterval: 15000,
  });

  const { data: poll } = useQuery({
    queryKey: ["poll", matchId],
    enabled: !!matchId,
    queryFn: async () => {
      if (!matchId) return undefined as Poll | undefined;
      const res = await api.get<ApiResponse<Poll[]>>(
        `/polls?matchId=${matchId}&isActive=true&limit=1`
      );
      return res.data?.[0];
    },
  });

  const [selected, setSelected] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    setSelected(null);
    setVoted(false);
  }, [poll?.id]);

  const totalVotes = useMemo(
    () => poll?.options?.reduce((t, o) => t + (o.votes?.length ?? 0), 0) ?? 0,
    [poll]
  );

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!poll || !selected) return;
      return api.post<ApiResponse<any>>(`/polls/${poll.id}/vote`, {
        optionId: selected,
      });
    },
    onSuccess: () => {
      setVoted(true);
      qc.invalidateQueries({ queryKey: ["poll", matchId] });
    },
  });

  if (!poll)
    return (
      <div className="text-sm text-[--color-textSecondary]">No active poll</div>
    );

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold">Fan Poll</h2>

      <AnimatePresence initial={false} mode="wait">
        {!voted ? (
          <m.div
            key="vote"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            <div className="text-sm text-[--color-textPrimary]">
              {poll.question}
            </div>
            <div className="space-y-2">
              {poll.options.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSelected(o.id)}
                  className={clsx(
                    "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm transition",
                    selected === o.id
                      ? "ring-2 ring-[--color-accent] accent-glow"
                      : "hover:bg-white/10"
                  )}
                >
                  {o.text}
                </button>
              ))}
            </div>
            <div className="pt-2">
              <button
                disabled={!selected || isPending}
                onClick={() => mutate()}
                className={clsx(
                  "rounded-md bg-[--color-accent] px-4 py-2 text-sm font-semibold text-white transition",
                  "hover:brightness-110 active:scale-[0.98]",
                  (!selected || isPending) && "opacity-50 cursor-not-allowed"
                )}
              >
                Submit Vote
              </button>
            </div>
          </m.div>
        ) : (
          <m.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            <div className="text-sm text-[--color-textPrimary]">
              {poll.question}
            </div>
            <div className="space-y-2">
              {poll.options.map((o) => {
                const count = o.votes?.length ?? 0;
                const pct = totalVotes
                  ? Math.round((count / totalVotes) * 100)
                  : 0;
                const isSelected = o.id === selected;
                return (
                  <div key={o.id} className="w-full">
                    <div className="mb-1 flex justify-between text-xs text-[--color-textSecondary]">
                      <span>{o.text}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded bg-white/10">
                      <m.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className={clsx(
                          "h-full",
                          isSelected ? "bg-[--color-accent]" : "bg-white/30"
                        )}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-xs text-[--color-textSecondary]">
              Total votes: {totalVotes}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
