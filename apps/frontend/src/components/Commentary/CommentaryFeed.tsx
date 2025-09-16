import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { api } from "../../data/client";
import { subscribeToMatch } from "../../realtime/socket";
import { useActiveMatch } from "../../state/activeMatch";

type CommentaryItem = {
  id?: string;
  timestamp?: string;
  minute?: number;
  text: string;
  type?: string;
};

type ApiResponse<T> = { status: string; data: T };

export function CommentaryFeed() {
  const { active } = useActiveMatch();

  // For demo, pick the first live match if available
  const { data: live } = useQuery({
    queryKey: ["live-match-id"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<any[]>>("/matches/live");
      return res.data?.[0]?.id as string | undefined;
    },
    refetchInterval: 15000,
  });

  // Use active match ID for socket connection, fallback to live match
  const matchId = active.id || live;
  console.log(
    "📰 CommentaryFeed matchId:",
    matchId,
    "active.id:",
    active.id,
    "live:",
    live
  );

  const { data } = useQuery({
    queryKey: ["commentary", matchId],
    enabled: !!matchId,
    queryFn: async () => {
      if (!matchId) return [] as CommentaryItem[];
      const res = await api.get<ApiResponse<CommentaryItem[]>>(
        `/commentary/match/${matchId}?limit=50`
      );
      return res.data ?? [];
    },
  });

  const [items, setItems] = useState<CommentaryItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);

  useEffect(() => {
    setItems(data ?? []);
  }, [data]);

  useEffect(() => {
    if (!matchId) return;
    return subscribeToMatch(matchId, (e) => {
      if (e.type === "new-commentary") {
        console.log("📰 Adding new commentary:", {
          minute: e.minute,
          text: e.text,
        });
        setItems((prev) => [...prev, { minute: e.minute, text: e.text }]);
      }
    });
  }, [matchId]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
      userScrolledRef.current = !nearBottom;
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || userScrolledRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, [items]);

  if (!matchId) {
    return (
      <div className="h-[70vh] overflow-y-auto" ref={containerRef}>
        <h2 className="mb-3 text-lg font-semibold">Live Commentary</h2>
        <div className="text-sm text-[--color-textSecondary]">
          No match selected. Start a simulation to see commentary.
        </div>
      </div>
    );
  }

  return (
    <div className="h-[70vh] overflow-y-auto" ref={containerRef}>
      <h2 className="mb-3 text-lg font-semibold">Live Commentary</h2>
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {items.map((entry, idx) => (
            <m.div
              key={`${entry.id ?? "local"}-${idx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-3 rounded-lg bg-white/5 p-3"
            >
              <div className="mt-0.5 text-xs text-[--color-textSecondary] min-w-10">
                {entry.minute ?? new Date(entry.timestamp ?? "").getMinutes()}′
              </div>
              <div className="flex-1 text-sm leading-relaxed">{entry.text}</div>
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
