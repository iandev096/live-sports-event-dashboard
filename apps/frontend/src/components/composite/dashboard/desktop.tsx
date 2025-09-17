import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCw, Settings } from "lucide-react";
import { ModeToggle } from "../mode-toggle";

function DesktopView() {
  return (
    <div id="dashboard-desktop-container">
      <div id="mode-toggle">
        <ModeToggle />
      </div>
      <section id="dashboard-desktop">
        <section id="team-a">TEAM A</section>
        <section id="poll-general-commentary">
          <section id="poll">POLL</section>
          <section id="commentary">COMMENTARY</section>
        </section>
        <section id="team-b">TEAM B</section>
      </section>
      <section id="simulation-controls">
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
      </section>
    </div>
  );
}

export default DesktopView;
