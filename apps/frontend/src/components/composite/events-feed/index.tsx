import { EmptyState } from "@/components/composite/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { MatchEvent } from "@/types";
import { MessageSquare } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { memo, useMemo } from "react";
import EventFeedItem from "./event-feed-item";

type EventFeedProps = {
  events: MatchEvent[];
  className?: string;
  hideScrollIndicators?: boolean;
};

function EventsFeedComponent({
  events,
  className,
  hideScrollIndicators = false,
}: EventFeedProps) {
  // Memoize sorted events to prevent re-sorting on every render
  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => b.minute - a.minute),
    [events]
  );

  if (events.length === 0) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <EmptyState
          icon={<MessageSquare className="h-12 w-12" />}
          title="No events yet"
          description="Match events and commentary will appear here as they happen."
        />
      </div>
    );
  }

  return (
    <ScrollArea className={cn("h-[400px] w-full", className)}>
      <div className="flex flex-col gap-4 p-4">
        {!hideScrollIndicators && (
          <div
            role="presentation"
            className="absolute top-0 left-0 right-0 w-full h-[20px] bg-linear-to-b from-slate-100 to-transparent dark:from-slate-900 dark:to-transparent"
          >
            <div className="sr-only">Scroll up to see more</div>
          </div>
        )}
        <AnimatePresence mode="popLayout">
          {sortedEvents.map((event) => (
            <EventFeedItem
              key={event.minute + event.description}
              event={event}
            />
          ))}
        </AnimatePresence>
        {!hideScrollIndicators && (
          <div
            role="presentation"
            className="absolute bottom-0 left-0 right-0 w-full h-[20px] bg-linear-to-t from-slate-100 to-transparent dark:from-slate-900 dark:to-transparent"
          >
            <div className="sr-only">Scroll down to see more</div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

const EventsFeed = memo(EventsFeedComponent);

// Attach Item as a static property
(EventsFeed as typeof EventsFeed & { Item: typeof EventFeedItem }).Item =
  EventFeedItem;

export default EventsFeed as typeof EventsFeed & { Item: typeof EventFeedItem };
