import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MatchEvent } from "@/types";
import { Edit2, Trash2 } from "lucide-react";
import { EVENT_TYPES } from "./timeline-form-types";

interface EventViewProps {
  event: MatchEvent;
  isConstantEvent: (eventType: string) => boolean;
  onEdit: () => void;
  onDelete: () => void;
}

// Desktop version
function DesktopEventView({
  event,
  isConstantEvent,
  onEdit,
  onDelete,
}: EventViewProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            {event.minute}'
          </Badge>
          <Badge
            variant={isConstantEvent(event.type) ? "default" : "secondary"}
            className="text-xs"
          >
            {EVENT_TYPES.find((t) => t.value === event.type)?.label ||
              event.type}
          </Badge>
          {event.team && (
            <Badge variant="outline" className="text-xs">
              {event.team === "teamA" ? "Team A" : "Team B"}
            </Badge>
          )}
        </div>
        <div className="text-sm font-medium">{event.description}</div>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          {event.player && <span>Player: {event.player}</span>}
          {event.metadata && Object.keys(event.metadata).length > 0 && (
            <span className="font-mono">
              {Object.entries(event.metadata)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ")}
            </span>
          )}
        </div>
      </div>
      <div className="flex space-x-2 ml-4">
        <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
          <Edit2 className="h-4 w-4" />
        </Button>
        {!isConstantEvent(event.type) && (
          <Button type="button" variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Mobile version
function MobileEventView({
  event,
  isConstantEvent,
  onEdit,
  onDelete,
}: EventViewProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            {event.minute}'
          </Badge>
          <Badge
            variant={isConstantEvent(event.type) ? "default" : "secondary"}
            className="text-xs"
          >
            {EVENT_TYPES.find((t) => t.value === event.type)?.label ||
              event.type}
          </Badge>
          {event.team && (
            <Badge variant="outline" className="text-xs">
              {event.team === "teamA" ? "Team A" : "Team B"}
            </Badge>
          )}
        </div>
        <div className="text-sm font-medium">{event.description}</div>
        <div className="flex flex-col items-start space-y-1 text-xs text-muted-foreground">
          {event.player && <span>Player: {event.player}</span>}
          {event.metadata && Object.keys(event.metadata).length > 0 && (
            <span className="font-mono">
              {Object.entries(event.metadata)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ")}
            </span>
          )}
        </div>
      </div>
      <div className="flex space-x-1 ml-2">
        <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
          <Edit2 className="h-3 w-3" />
        </Button>
        {!isConstantEvent(event.type) && (
          <Button type="button" variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Compound component
export const EventView = {
  Desktop: DesktopEventView,
  Mobile: MobileEventView,
};
