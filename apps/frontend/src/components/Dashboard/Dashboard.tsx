import { CommentaryFeed } from "../Commentary/CommentaryFeed";
import { PollWidget } from "../Poll/PollWidget";
import { Scoreboard } from "../Scoreboard/Scoreboard";
import { StatsPanel } from "../Stats/StatsPanel";

export function Dashboard() {
  return (
    <div className="min-h-screen w-full">
      <div className="sticky top-0 z-20 p-4 backdrop-blur-md">
        <div className="glass-panel accent-glow">
          <Scoreboard />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 p-4 md:grid-cols-3">
        <div className="md:col-span-1 order-2 md:order-1">
          <div className="glass-panel p-4">
            <CommentaryFeed />
          </div>
        </div>
        <div className="md:col-span-1 order-1 md:order-2">
          <div className="glass-panel p-4">
            <PollWidget />
          </div>
        </div>
        <div className="md:col-span-1 order-3">
          <div className="glass-panel p-4">
            <StatsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
