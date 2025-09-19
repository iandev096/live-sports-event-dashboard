import { matchEvents, teamAEvents, teamBEvents } from "@/mock/match-events";
import { mockPoll } from "@/mock/poll-data";
import ActivePoll from "../active-poll";
import EventsFeed from "../events-feed";
import { ModeToggle } from "../mode-toggle";
import SimulationControls from "../simulation-controls";
import TeamCard from "../team-card";
import TeamEvents from "../team-events";

function DesktopView() {
  return (
    <>
      <header className="flex justify-between items-center p-4 bg-white dark:bg-slate-950 rounded-lg">
        <h1 className="text-2xl font-bold">Match Simulation Dashboard</h1>
        <div id="mode-toggle" className="">
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
            <TeamCard teamName="Manchester United" teamScore={0} />
            <TeamEvents events={teamAEvents} className="flex-1" />
          </section>
          <section id="poll-general-commentary" className="flex flex-col gap-4">
            <section id="poll">
              <ActivePoll poll={mockPoll} />
            </section>
            {/* general commentary */}
            <EventsFeed
              events={matchEvents.filter((event) => !event.team)}
              className="flex-1"
            />
          </section>
          <section id="team-b" className="flex flex-col gap-4">
            <TeamCard teamName="Liverpool" teamScore={0} />
            <TeamEvents events={teamBEvents} className="flex-1" />
          </section>
        </section>
        <SimulationControls />
      </div>
    </>
  );
}

export default DesktopView;
