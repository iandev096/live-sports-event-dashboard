import { useSimulation } from "@/components/providers/simulation-provider";
import { mockMatchTimeline } from "@/mock/match-timeline";
import type { MatchTimeline } from "@/types";
import { useState } from "react";
import ConnectionStatus from "../connection-status";
import EventsFeed from "../events-feed";
import MatchInfoInline from "../match-info/inline";
import { MobileSettingsModal } from "../mobile-settings-modal";
import { ModeToggle } from "../mode-toggle";
import { PollDialog } from "../poll-dialog";
import { PollFAB } from "../poll-fab";
import { ScrollToTop } from "../scroll-to-top";
import ShareSimulationButton from "../share-simulation-button";
import { SimulationFAB } from "../simulation-fab";
import TeamCard from "../team-card";
import ViewerModeBanner from "../viewer-mode-banner";

function MobileView() {
  const [isPollOpen, setIsPollOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    matchState,
    events,
    isSimulationRunning,
    isOwner,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    poll,
    hasVoted,
    userVote,
    votePoll,
  } = useSimulation();

  // Get team names from match state or use mock data
  const teamA = matchState?.teamA || mockMatchTimeline.teamA;
  const teamB = matchState?.teamB || mockMatchTimeline.teamB;
  const scoreA = matchState?.scoreA || 0;
  const scoreB = matchState?.scoreB || 0;

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
      startSimulation(teamA, teamB);
    }
  };

  const handleReset = () => {
    if (!isOwner) return;
    resetSimulation();
  };

  const handleSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleSaveSettings = (timeline: MatchTimeline) => {
    console.log("Saving timeline:", timeline);
    if (isOwner) {
      startSimulation(timeline.teamA, timeline.teamB);
    }
    setIsSettingsOpen(false);
  };

  const handlePoll = () => {
    setIsPollOpen(true);
  };

  const handleVote = (optionId: string) => {
    votePoll(optionId);
  };

  return (
    <>
      <ViewerModeBanner />
      <header className="flex justify-between items-center p-4 bg-white dark:bg-slate-950 rounded-lg">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl sm:text-2xl font-bold">Match Simulation</h1>
          <div className="flex items-center gap-2">
            <ConnectionStatus showText={false} />
            <MatchInfoInline />
          </div>
        </div>
        <div className="flex items-center gap-2 self-start">
          <ShareSimulationButton size="sm" />
          <ModeToggle />
        </div>
      </header>

      <section id="dashboard-mobile">
        <section
          id="teams-mobile"
          className="grid grid-cols-2 gap-4 sticky top-0 z-10 bg-white dark:bg-slate-950 py-4"
        >
          <section id="team-a-mobile">
            <TeamCard
              teamName={teamA}
              teamScore={scoreA}
              teamLogo={`https://api.dicebear.com/7.x/identicon/svg?seed=${teamA}`}
            />
          </section>
          <section id="team-b-mobile">
            <TeamCard
              teamName={teamB}
              teamScore={scoreB}
              teamLogo={`https://api.dicebear.com/7.x/identicon/svg?seed=${teamB}`}
            />
          </section>
        </section>
        <section id="commentary-mobile" className="z-1">
          <EventsFeed
            events={events}
            className="flex-1 h-auto"
            hideScrollIndicators
          />
        </section>
      </section>

      {/* Floating Action Buttons */}
      <SimulationFAB
        isPlaying={isSimulationRunning}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        onSettings={handleSettings}
        disabled={!isOwner}
      />

      {poll && <PollFAB onClick={handlePoll} />}

      {/* Scroll to Top Button */}
      <ScrollToTop threshold={200} />

      {/* Poll Dialog */}
      {poll && (
        <PollDialog
          isOpen={isPollOpen}
          onClose={() => setIsPollOpen(false)}
          poll={poll}
          onVote={handleVote}
          hasVoted={hasVoted}
          userVote={userVote || undefined}
        />
      )}

      {/* Settings Modal */}
      <MobileSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        initialTimeline={mockMatchTimeline}
      />
    </>
  );
}

export default MobileView;
