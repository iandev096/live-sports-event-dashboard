import { Button } from "@/components/ui/button";
import { mockMatchTimeline } from "@/mock/match-timeline";
import type { MatchTimeline } from "@/types";
import { Pause, Play, RotateCw, Settings } from "lucide-react";
import { useState } from "react";
import { DesktopSettingsModal } from "../desktop-settings-modal";

function SimulationControls() {
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);

  const handleTimelineSave = (timeline: MatchTimeline) => {
    console.log("Timeline saved:", timeline);
    // TODO: Implement timeline saving logic
    // This could save to localStorage, send to backend, or update state
  };

  return (
    <>
      <section id="simulation-controls" className="w-full flex justify-around">
        <Button variant="ghost" className="size-14">
          <Play className="size-6" />
          {false && <Pause className="size-6" />}
        </Button>
        <Button variant="ghost" className="size-14">
          <RotateCw className="size-6" />
        </Button>
        <Button
          variant="ghost"
          className="size-14"
          onClick={() => setIsTimelineModalOpen(true)}
        >
          <Settings className="size-6" />
        </Button>
      </section>

      <DesktopSettingsModal
        isOpen={isTimelineModalOpen}
        onClose={() => setIsTimelineModalOpen(false)}
        onSave={handleTimelineSave}
        initialTimeline={mockMatchTimeline}
      />
    </>
  );
}

export default SimulationControls;
