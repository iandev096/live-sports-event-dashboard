import { mockMatchTimeline } from "@/mock/match-timeline";
import { mockPoll } from "@/mock/poll-data";
import type { MatchTimeline } from "@/types";
import { useState } from "react";
import EventsFeed from "../events-feed";
import { MobileSettingsModal } from "../mobile-settings-modal";
import { ModeToggle } from "../mode-toggle";
import { PollDialog } from "../poll-dialog";
import { PollFAB } from "../poll-fab";
import { ScrollToTop } from "../scroll-to-top";
import { SimulationFAB } from "../simulation-fab";
import TeamCard from "../team-card";

function MobileView() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPollOpen, setIsPollOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    console.log(isPlaying ? "Pausing simulation" : "Starting simulation");
  };

  const handleReset = () => {
    setIsPlaying(false);
    console.log("Resetting simulation");
  };

  const handleSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleSaveSettings = (timeline: MatchTimeline) => {
    console.log("Saving timeline:", timeline);
    // TODO: Implement actual timeline saving logic
    setIsSettingsOpen(false);
  };

  const handlePoll = () => {
    setIsPollOpen(true);
  };

  const handleVote = async (optionId: string) => {
    console.log("Voting for option:", optionId);
    // TODO: Implement actual voting logic
  };

  return (
    <>
      <header className="flex justify-between items-center p-4 bg-white dark:bg-slate-950 rounded-lg">
        <h1 className="text-xl sm:text-2xl font-bold">Match Simulation</h1>
        <div id="mode-toggle" className="">
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
              teamName={mockMatchTimeline.teamA}
              teamScore={0}
              teamLogo={`https://api.dicebear.com/7.x/identicon/svg?seed=${mockMatchTimeline.teamA}`}
            />
          </section>
          <section id="team-b-mobile">
            <TeamCard
              teamName={mockMatchTimeline.teamB}
              teamScore={0}
              teamLogo={`https://api.dicebear.com/7.x/identicon/svg?seed=${mockMatchTimeline.teamB}`}
            />
          </section>
        </section>
        <section id="commentary-mobile" className="z-1">
          <EventsFeed
            events={mockMatchTimeline.events}
            className="flex-1 h-auto"
            hideScrollIndicators
          />
        </section>
      </section>

      {/* Floating Action Buttons */}
      <SimulationFAB
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        onSettings={handleSettings}
      />

      <PollFAB onClick={handlePoll} />

      {/* Scroll to Top Button */}
      <ScrollToTop threshold={200} />

      {/* Poll Dialog */}
      <PollDialog
        isOpen={isPollOpen}
        onClose={() => setIsPollOpen(false)}
        poll={mockPoll}
        onVote={handleVote}
        hasVoted={false}
      />

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
