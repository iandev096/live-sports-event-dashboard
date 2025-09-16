import { m } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useLiveMatch } from "../../data/hooks/useLiveMatch";
import { subscribeToMatch } from "../../realtime/socket";
import { useActiveMatch } from "../../state/activeMatch";
import { SimulationControls } from "./SimulationControls";

export function Scoreboard() {
  const { data: match } = useLiveMatch();
  const { active } = useActiveMatch();

  const [clock, setClock] = useState(0);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!match?.isLive) return;
    setClock(match.currentTime ?? 0);
    setScoreA(match.scoreA ?? 0);
    setScoreB(match.scoreB ?? 0);
    setIsLive(match.isLive ?? false);
  }, [match?.currentTime, match?.isLive, match?.scoreA, match?.scoreB]);

  // Use active match ID for socket connection
  const matchId = active.id;

  useEffect(() => {
    if (!matchId) return;
    return subscribeToMatch(matchId, (e) => {
      if (e.type === "time-update") {
        setClock(e.currentTime);
      }
      if (e.type === "score-update") {
        setScoreA(e.teamA);
        setScoreB(e.teamB);
      }
      if (e.type === "match-start") {
        setIsLive(true);
      }
    });
  }, [matchId]);

  const teamA = useMemo(
    () => active.teamA ?? match?.teamA ?? "Team A",
    [active.teamA, match?.teamA]
  );
  const teamB = useMemo(
    () => active.teamB ?? match?.teamB ?? "Team B",
    [active.teamB, match?.teamB]
  );

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-lg text-[--color-textSecondary]">{teamA}</span>
        <m.div
          key={`${scoreA}-${scoreB}`}
          initial={{ scale: 1.05, color: "var(--color-accent)" }}
          animate={{ scale: 1, color: "var(--color-textPrimary)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-3xl font-extrabold"
        >
          {scoreA} : {scoreB}
        </m.div>
        <span className="text-lg text-[--color-textSecondary]">{teamB}</span>
      </div>

      <div className="flex items-center gap-4">
        <m.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-[--color-textSecondary]"
        >
          {Math.floor(clock)}′
        </m.div>
        <div className="flex items-center gap-2">
          <m.span
            animate={{
              opacity: isLive ? [0.6, 1, 0.6] : 0.4,
              scale: isLive ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 1.2, repeat: isLive ? Infinity : 0 }}
            className="inline-flex h-2.5 w-2.5 rounded-full bg-[--color-success] shadow-[0_0_12px_2px_rgba(16,185,129,0.6)]"
          />
          <span className="text-xs tracking-widest text-[--color-textSecondary]">
            {isLive ? "LIVE" : "OFF"}
          </span>
        </div>
        <div className="ml-4 border-l border-white/10 pl-4">
          <SimulationControls />
        </div>
      </div>
    </div>
  );
}
