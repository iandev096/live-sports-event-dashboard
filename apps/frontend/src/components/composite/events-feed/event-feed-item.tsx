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
  } = useEventUtils();

  // Determine animation based on event type
  const getAnimationProps = () => {
    switch (type) {
      case "goal":
        // Subtle goal celebration: gentle bounce
        return {
          initial: { opacity: 0, scale: 0.85, y: -15 },
          animate: {
            opacity: 1,
            scale: [0.85, 1.05, 1], // Gentle overshoot
            y: 0,
          },
          transition: {
            duration: 0.5,
            ease: [0.34, 1.2, 0.64, 1] as [number, number, number, number], // Subtle bounce
            scale: {
              times: [0, 0.6, 1],
              duration: 0.5,
            },
          },
        };

      case "yellow-card":
        // Subtle shake for yellow card
        return {
          initial: { opacity: 0, x: -20, rotate: -3 },
          animate: {
            opacity: 1,
            x: [0, -4, 4, -2, 0], // Gentler shake
            rotate: 0,
          },
          transition: {
            duration: 0.45,
            ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], // Smoother easing
            x: {
              times: [0, 0.25, 0.5, 0.75, 1],
              duration: 0.45,
            },
          },
        };

      case "red-card":
        // More noticeable shake for red card but still controlled
        return {
          initial: { opacity: 0, x: 20, scale: 0.9, rotate: 3 },
          animate: {
            opacity: [0, 1], // Remove flash
            x: [0, -6, 6, -3, 3, 0], // Moderate shake
            scale: [0.9, 1.03, 1], // Subtle impact
            rotate: 0,
          },
          transition: {
            duration: 0.55,
            ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], // Smoother easing
            x: {
              times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              duration: 0.55,
            },
          },
        };

      default:
        // Standard smooth animation for regular events
        return {
          initial: { opacity: 0, y: -20, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], // easeOutQuad
          },
        };
    }
  };

  const animationProps = getAnimationProps();

  return (
    <MotionCard
      {...animationProps}
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
