import { useActions } from "@/components/providers/actions-provider";
import { useMatchState } from "@/components/providers/match-state-provider";
import { Button } from "@/components/ui/button";
import { mockMatchTimeline } from "@/mock/match-timeline";
import type { MatchTimeline } from "@/types";
import { Pause, Play, RotateCw, Settings } from "lucide-react";
import { useState } from "react";
import { DesktopSettingsModal } from "../desktop-settings-modal";

function SimulationControls() {
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const { matchState, isSimulationRunning } = useMatchState();
  const {
    isOwner,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
  } = useActions();

  const handlePlayPause = () => {
    if (!isOwner) return;

    if (isSimulationRunning) {
      // Pause if currently running
      pauseSimulation();
    } else if (matchState) {
      // Resume if paused (matchState exists)
      resumeSimulation();
    } else {
      // Start new simulation (no matchState = fresh start)
      startSimulation(mockMatchTimeline.teamA, mockMatchTimeline.teamB);
    }
  };

  const handleReset = () => {
    if (!isOwner) return;
    resetSimulation();
  };

  const handleTimelineSave = (timeline: MatchTimeline) => {
    console.log("Timeline saved:", timeline);
    // Start simulation with new teams
    if (isOwner) {
      startSimulation(timeline.teamA, timeline.teamB);
    }
  };

  const handleTimelineOpen = () => {
    setIsTimelineModalOpen(true);
  };

  const handleTimelineClose = () => {
    setIsTimelineModalOpen(false);
  };

  // Hide controls completely in viewer mode
  if (!isOwner) {
    return null;
  }

  return (
    <>
      <section id="simulation-controls" className="w-full flex justify-around">
        <Button
          variant="ghost"
          className="size-14"
          onClick={handlePlayPause}
          title={isSimulationRunning ? "Pause simulation" : "Start simulation"}
        >
          {isSimulationRunning ? (
            <Pause className="size-6" />
          ) : (
            <Play className="size-6" />
          )}
        </Button>
        <Button
          variant="ghost"
          className="size-14"
          onClick={handleReset}
          title="Reset simulation"
        >
          <RotateCw className="size-6" />
        </Button>
        <Button
          variant="ghost"
          className="size-14"
          onClick={handleTimelineOpen}
          title="Settings"
        >
          <Settings className="size-6" />
        </Button>
      </section>

      <DesktopSettingsModal
        isOpen={isTimelineModalOpen}
        onClose={handleTimelineClose}
        onSave={handleTimelineSave}
        initialTimeline={mockMatchTimeline}
      />
    </>
  );
}

export default SimulationControls;
