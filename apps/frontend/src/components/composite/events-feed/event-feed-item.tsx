import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useEventUtils } from "@/hooks/useEventUtils";
import type { MatchEvent } from "@/types";
import { motion } from "motion/react";

type EventFeedItemProps = {
  event: MatchEvent;
};

// Create motion-enhanced Card component
const MotionCard = motion.create(Card);

function EventFeedItem({ event }: EventFeedItemProps) {
  const { description, minute, type, team, player, metadata } = event;

  const {
    getEventIcon,
    getEventColor,
    getEventBadgeVariant,
    getEventTypeLabel,
    isImportantEvent,
    getEventAnimation,
    getEventMotionProps,
  } = useEventUtils();

  const { initial, animate, transition } = getEventMotionProps(type);

  return (
    <MotionCard
      initial={initial}
      animate={animate}
      transition={transition}
      layout
      className={`mb-2 ${getEventColor(type)} ${getEventAnimation(type)}`}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">{getEventIcon(type)}</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant={getEventBadgeVariant(type)}
                className={`text-xs ${
                  isImportantEvent(type) ? "ring-2 ring-current/50" : ""
                }`}
              >
                {getEventTypeLabel(type)}
              </Badge>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {minute}'
              </span>
            </div>

            <p className="text-sm text-gray-900 dark:text-gray-100 mb-1">
              {description}
            </p>

            {player && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Player: <span className="font-medium">{player}</span>
              </p>
            )}

            {team && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Team:{" "}
                <span className="font-medium">
                  {team === "teamA" ? "Team A" : "Team B"}
                </span>
              </p>
            )}

            {metadata && Object.keys(metadata).length > 0 && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                {Object.entries(metadata).map(([key, value]) => (
                  <div key={key}>
                    {key}: {String(value)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </MotionCard>
  );
}

export default EventFeedItem;
