import { useActions } from "@/components/providers/actions-provider";
import { useEvents } from "@/components/providers/events-provider";
import { useMatchState } from "@/components/providers/match-state-provider";
import { mockMatchTimeline } from "@/mock/match-timeline";
import { useMemo } from "react";
import ActivePoll from "../active-poll";
import ConnectionStatus from "../connection-status";
import EventsFeed from "../events-feed";
import MatchInfoInline from "../match-info";
import { ModeToggle } from "../mode-toggle";
import ShareSimulationButton from "../share-simulation-button";
import SimulationControls from "../simulation-controls";
import TeamCard from "../team-card";
import TeamEvents from "../team-events";
import ViewerModeBanner from "../viewer-mode-banner";

function DesktopView() {
  const { matchState } = useMatchState();
  const { events, poll, hasVoted, userVote } = useEvents();
  const { votePoll } = useActions();

  // Get team names from match state or use mock data
  const teamA = matchState?.teamA || mockMatchTimeline.teamA;
  const teamB = matchState?.teamB || mockMatchTimeline.teamB;
  const scoreA = matchState?.scoreA || 0;
  const scoreB = matchState?.scoreB || 0;

  // Filter events by team
  const teamAEvents = useMemo(
    () => events.filter((event) => event.team === "teamA"),
    [events]
  );

  const teamBEvents = useMemo(
    () => events.filter((event) => event.team === "teamB"),
    [events]
  );

  const generalEvents = useMemo(
    () => events.filter((event) => !event.team),
    [events]
  );

  // Memoize logo URLs to prevent TeamCard rerenders
  const teamALogo = useMemo(
    () => `https://api.dicebear.com/7.x/identicon/svg?seed=${teamA}`,
    [teamA]
  );

  const teamBLogo = useMemo(
    () => `https://api.dicebear.com/7.x/identicon/svg?seed=${teamB}`,
    [teamB]
  );

  return (
    <>
      <ViewerModeBanner />
      <header className="flex justify-between items-center p-4 bg-white dark:bg-slate-950 rounded-lg">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Match Simulation Dashboard</h1>
          <ConnectionStatus />
          <MatchInfoInline />
        </div>
        <div className="flex items-center gap-2">
          <ShareSimulationButton />
          <ModeToggle />
        </div>
      </header>
      <div
        id="dashboard-desktop-container"
        className="relative bg-slate-100 dark:bg-slate-900 rounded-lg p-4"
      >
        <section
          id="dashboard-desktop"
          className="grid grid-cols-3 gap-4 *:h-[calc(100dvh-230px)] overflow-hidden"
        >
          <section id="team-a" className="flex flex-col gap-4">
            <TeamCard
              teamName={teamA}
              teamScore={scoreA}
              teamLogo={teamALogo}
            />
            <TeamEvents events={teamAEvents} className="flex-1" />
          </section>
          <section id="poll-general-commentary" className="flex flex-col gap-4">
            {poll && (
              <section id="poll">
                <ActivePoll
                  poll={poll}
                  onVote={votePoll}
                  hasVoted={hasVoted}
                  userVote={userVote || undefined}
                />
              </section>
            )}
            {/* general commentary */}
            <EventsFeed events={generalEvents} className="flex-1" />
          </section>
          <section id="team-b" className="flex flex-col gap-4">
            <TeamCard
              teamName={teamB}
              teamScore={scoreB}
              teamLogo={teamBLogo}
            />
            <TeamEvents events={teamBEvents} className="flex-1" />
          </section>
        </section>
        <SimulationControls />
      </div>
    </>
  );
}

export default DesktopView;
