import { useMatchState } from "@/components/providers/match-state-provider";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Compact inline version of match info for header
 * Only subscribes to matchState context - won't rerender when events change!
 */
function MatchInfoInline() {
  const { matchState, isSimulationRunning } = useMatchState();
  const [displayTime, setDisplayTime] = useState(0);

  // Sync display time with match state
  useEffect(() => {
    if (matchState) {
      setDisplayTime(matchState.currentTime);
    }
  }, [matchState?.currentTime]);

  // Smoothly increment time while running (fallback between server updates)
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      setDisplayTime((prev) => prev + 1 / 60); // Increment by 1 second
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulationRunning]);

  if (!matchState) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 px-3 py-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-md">
        <div className="w-2 h-2 rounded-full bg-slate-400" />
        <span>No match</span>
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}'${secs.toString().padStart(2, "0")}`;
  };

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case "pre-match":
        return "Pre";
      case "first-half":
        return "1st";
      case "half-time":
        return "HT";
      case "second-half":
        return "2nd";
      case "full-time":
        return "FT";
      case "extra-time":
        return "ET";
      case "penalties":
        return "Pen";
      default:
        return phase.substring(0, 3);
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "first-half":
      case "second-half":
      case "extra-time":
        return "default";
      case "half-time":
        return "secondary";
      case "full-time":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-md">
      {/* Status indicator */}
      <div
        className={`w-2 h-2 rounded-full ${
          isSimulationRunning ? "bg-green-500 animate-pulse" : "bg-slate-400"
        }`}
        title={isSimulationRunning ? "Live" : "Paused"}
      />

      {/* Phase badge */}
      <Badge variant={getPhaseColor(matchState.phase)} className="text-xs">
        {getPhaseLabel(matchState.phase)}
      </Badge>

      {/* Time */}
      <div className="flex items-center gap-1 text-sm font-mono font-semibold">
        <Clock className="h-3.5 w-3.5 text-slate-500" />
        <span>{formatTime(displayTime)}</span>
      </div>
    </div>
  );
}

export default MatchInfoInline;
