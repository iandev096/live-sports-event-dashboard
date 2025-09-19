import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { EventType, MatchEvent } from "@/types";
import { Plus } from "lucide-react";
import { EVENT_TYPES } from "./timeline-form-types";

interface NewEventFormProps {
  newEvent: Partial<MatchEvent>;
  setNewEvent: (event: Partial<MatchEvent>) => void;
  onAddEvent: () => void;
}

// Desktop version
function DesktopNewEventForm({
  newEvent,
  setNewEvent,
  onAddEvent,
}: NewEventFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Event
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          <div className="md:col-span-1">
            <Input
              type="number"
              placeholder="Min"
              value={newEvent.minute || ""}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  minute: parseInt(e.target.value) || 0,
                })
              }
              className="text-center"
            />
          </div>
          <div className="md:col-span-2">
            <Select
              value={newEvent.type || ""}
              onValueChange={(value) =>
                setNewEvent({ ...newEvent, type: value as EventType })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Event type" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-1">
            <Select
              value={newEvent.team || ""}
              onValueChange={(value) =>
                setNewEvent({
                  ...newEvent,
                  team: value as "teamA" | "teamB",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teamA">Team A</SelectItem>
                <SelectItem value="teamB">Team B</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Input
              placeholder="Player (optional)"
              value={newEvent.player || ""}
              onChange={(e) =>
                setNewEvent({ ...newEvent, player: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-1">
            <Button
              type="button"
              onClick={onAddEvent}
              size="sm"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea
            placeholder="Event description"
            value={newEvent.description || ""}
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                description: e.target.value,
              })
            }
            rows={4}
            className="min-h-[80px] max-h-[150px]"
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Metadata (JSON)</label>
            <Textarea
              placeholder='{"key": "value"}'
              value={
                newEvent.metadata
                  ? JSON.stringify(newEvent.metadata, null, 2)
                  : ""
              }
              onChange={(e) => {
                try {
                  const metadata = e.target.value
                    ? JSON.parse(e.target.value)
                    : undefined;
                  setNewEvent({ ...newEvent, metadata });
                } catch {
                  // Invalid JSON, keep the text for user to fix
                  setNewEvent({ ...newEvent, metadata: undefined });
                }
              }}
              className="min-h-[80px] max-h-[100px] font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Optional JSON metadata for the event
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mobile version
function MobileNewEventForm({
  newEvent,
  setNewEvent,
  onAddEvent,
}: NewEventFormProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Event
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1">
            <label className="text-xs font-medium mb-1 block">Minute</label>
            <Input
              type="number"
              placeholder="Min"
              value={newEvent.minute || ""}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  minute: parseInt(e.target.value) || 0,
                })
              }
              className="text-center"
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium mb-1 block">Team</label>
            <Select
              value={newEvent.team || ""}
              onValueChange={(value) =>
                setNewEvent({
                  ...newEvent,
                  team: value as "teamA" | "teamB",
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teamA">Team A</SelectItem>
                <SelectItem value="teamB">Team B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium mb-1 block">Event Type</label>
          <Select
            value={newEvent.type || ""}
            onValueChange={(value) =>
              setNewEvent({
                ...newEvent,
                type: value as EventType,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Event type" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium mb-1 block">
            Player (optional)
          </label>
          <Input
            placeholder="Player name"
            value={newEvent.player || ""}
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                player: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="text-xs font-medium mb-1 block">Description</label>
          <Textarea
            placeholder="Event description"
            value={newEvent.description || ""}
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                description: e.target.value,
              })
            }
            rows={3}
            className="min-h-[60px]"
          />
        </div>

        <Button
          type="button"
          onClick={onAddEvent}
          size="sm"
          className="w-full"
          disabled={!newEvent.description || !newEvent.type}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </CardContent>
    </Card>
  );
}

// Compound component
export const NewEventForm = {
  Desktop: DesktopNewEventForm,
  Mobile: MobileNewEventForm,
};
