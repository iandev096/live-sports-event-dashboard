import { EmptyState } from "@/components/composite/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { MatchEvent } from "@/types";
import { Activity } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { memo, useMemo } from "react";
import { TeamEventItem } from "./team-event-item";

type TeamEventsProps = {
  events: MatchEvent[];
  className?: string;
};

function TeamEventsComponent({ events, className }: TeamEventsProps) {
  // Memoize sorted events to prevent re-sorting on every render
  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => b.minute - a.minute),
    [events]
  );

  if (events.length === 0) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <EmptyState
          icon={<Activity className="h-12 w-12" />}
          title="No team events yet"
          description="Team events will appear here as they happen during the match."
        />
      </div>
    );
  }

  return (
    <ScrollArea className={cn("h-[400px] w-full relative", className)}>
      <div className="flex flex-col gap-4 p-4">
        <div
          role="presentation"
          className="absolute top-0 left-0 right-0 w-full h-[20px] bg-linear-to-b from-slate-100 to-transparent dark:from-slate-900 dark:to-transparent"
        >
          <div className="sr-only">Scroll up to see more</div>
        </div>
        <AnimatePresence mode="popLayout">
          {sortedEvents.map((event) => (
            <TeamEventItem key={event.minute + event.description} {...event} />
          ))}
        </AnimatePresence>
        <div
          role="presentation"
          className="absolute bottom-0 left-0 right-0 w-full h-[20px] bg-linear-to-t from-slate-100 to-transparent dark:from-slate-900 dark:to-transparent"
        >
          <div className="sr-only">Scroll down to see more</div>
        </div>
      </div>
    </ScrollArea>
  );
}

const TeamEvents = memo(TeamEventsComponent);

// Attach Item as a static property
(TeamEvents as typeof TeamEvents & { Item: typeof TeamEventItem }).Item =
  TeamEventItem;

export default TeamEvents as typeof TeamEvents & { Item: typeof TeamEventItem };
