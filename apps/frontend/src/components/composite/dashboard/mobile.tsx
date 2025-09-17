import { Button } from "@/components/ui/button";
import { ChartColumn, Pause, Play, RotateCw, Settings } from "lucide-react";
import { ModeToggle } from "../mode-toggle";

function MobileView() {
  return (
    <div id="dashboard-mobile-container">
      <div id="mode-toggle">
        <ModeToggle />
      </div>
      <section id="dashboard-mobile">
        <section id="teams-mobile">
          <section id="team-a-mobile">TEAM A</section>
          <section id="team-b-mobile">TEAM B</section>
        </section>
        <section id="commentary-mobile">COMMENTARY</section>
      </section>
      <section id="controls-mobile">
        <div id="simulation-controls-mobile">
          <Button variant="ghost">
            <Play />
            <Pause />
          </Button>
          <Button variant="ghost">
            <RotateCw />
          </Button>
          <Button variant="ghost">
            <Settings />
          </Button>
        </div>
        <div id="poll-mobile">
          <Button variant="ghost">
            <ChartColumn />
          </Button>
        </div>
      </section>
    </div>
  );
}

export default MobileView;
