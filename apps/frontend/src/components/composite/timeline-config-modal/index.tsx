import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { EventType, MatchEvent, MatchTimeline } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogOverlay } from "@radix-ui/react-dialog";
import { Check, Edit2, Plus, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const eventSchema = z.object({
  minute: z.number().min(0).max(120),
  type: z.enum([
    "kickoff",
    "goal",
    "yellow-card",
    "red-card",
    "substitution",
    "shot",
    "save",
    "corner",
    "free-kick",
    "penalty",
    "penalties",
    "half-time",
    "full-time",
    "extra-time",
    "commentary",
  ]),
  team: z.enum(["teamA", "teamB"]).optional(),
  player: z.string().optional(),
  description: z.string().min(1),
  metadata: z.record(z.string(), z.any()).optional(),
});

const timelineSchema = z.object({
  matchId: z.string(),
  teamA: z.string().min(1),
  teamB: z.string().min(1),
  matchType: z.enum(["standard", "extra-time", "penalties"]),
  events: z.array(eventSchema),
});

type TimelineFormData = z.infer<typeof timelineSchema>;

interface DesktopSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (timeline: MatchTimeline) => void;
  initialTimeline?: MatchTimeline;
}

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "kickoff", label: "Kickoff" },
  { value: "goal", label: "Goal" },
  { value: "yellow-card", label: "Yellow Card" },
  { value: "red-card", label: "Red Card" },
  { value: "substitution", label: "Substitution" },
  { value: "shot", label: "Shot" },
  { value: "save", label: "Save" },
  { value: "corner", label: "Corner" },
  { value: "free-kick", label: "Free Kick" },
  { value: "penalty", label: "Penalty" },
  { value: "penalties", label: "Penalties" },
  { value: "half-time", label: "Half Time" },
  { value: "full-time", label: "Full Time" },
  { value: "extra-time", label: "Extra Time" },
  { value: "commentary", label: "Commentary" },
];

const CONSTANT_EVENTS = {
  standard: ["kickoff", "half-time", "full-time"],
  "extra-time": ["kickoff", "half-time", "extra-time", "full-time"],
  penalties: ["kickoff", "half-time", "full-time", "penalties"],
};

export function DesktopSettingsModal({
  isOpen,
  onClose,
  onSave,
  initialTimeline,
}: DesktopSettingsModalProps) {
  const [newEvent, setNewEvent] = useState<Partial<MatchEvent>>({
    minute: 0,
    type: "commentary",
    description: "",
  });
  const [editingEvent, setEditingEvent] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{
    description: string;
    metadata: string;
  }>({ description: "", metadata: "" });

  const form = useForm<TimelineFormData>({
    resolver: zodResolver(timelineSchema),
    defaultValues: {
      matchId: initialTimeline?.matchId || "custom-match",
      teamA: initialTimeline?.teamA || "Team A",
      teamB: initialTimeline?.teamB || "Team B",
      matchType: "standard",
      events: initialTimeline?.events || [],
    },
  });

  const watchMatchType = form.watch("matchType");
  const events = form.watch("events");

  const isConstantEvent = (eventType: string) => {
    return CONSTANT_EVENTS[
      watchMatchType as keyof typeof CONSTANT_EVENTS
    ].includes(eventType);
  };

  const addEvent = () => {
    if (
      newEvent.description &&
      newEvent.minute !== undefined &&
      newEvent.type
    ) {
      const currentEvents = form.getValues("events");
      const eventToAdd: MatchEvent = {
        minute: newEvent.minute,
        type: newEvent.type as EventType,
        description: newEvent.description,
        team: newEvent.team as "teamA" | "teamB" | undefined,
        player: newEvent.player,
        metadata: newEvent.metadata,
      };
      form.setValue("events", [...currentEvents, eventToAdd]);
      setNewEvent({ minute: 0, type: "commentary", description: "" });
    }
  };

  const deleteEvent = (index: number) => {
    const currentEvents = form.getValues("events");
    currentEvents.splice(index, 1);
    form.setValue("events", currentEvents);
  };

  const startEditing = (index: number) => {
    const event = sortedEvents[index];
    setEditingEvent(index);
    setEditForm({
      description: event.description,
      metadata: event.metadata ? JSON.stringify(event.metadata, null, 2) : "",
    });
  };

  const cancelEditing = () => {
    setEditingEvent(null);
    setEditForm({ description: "", metadata: "" });
  };

  const saveEdit = () => {
    if (editingEvent === null) return;

    const currentEvents = form.getValues("events");
    const eventIndex = currentEvents.findIndex(
      (_, index) => index === editingEvent
    );

    if (eventIndex !== -1) {
      let metadata;
      try {
        metadata = editForm.metadata
          ? JSON.parse(editForm.metadata)
          : undefined;
      } catch {
        // Invalid JSON, keep existing metadata
        metadata = currentEvents[eventIndex].metadata;
      }

      currentEvents[eventIndex] = {
        ...currentEvents[eventIndex],
        description: editForm.description,
        metadata,
      };

      form.setValue("events", currentEvents);
    }

    setEditingEvent(null);
    setEditForm({ description: "", metadata: "" });
  };

  const handleSave = (data: TimelineFormData) => {
    const timeline: MatchTimeline = {
      matchId: data.matchId,
      teamA: data.teamA,
      teamB: data.teamB,
      events: data.events.sort((a, b) => a.minute - b.minute),
      duration:
        data.matchType === "penalties"
          ? 125
          : data.matchType === "extra-time"
          ? 120
          : 90,
    };
    onSave(timeline);
    onClose();
  };

  const sortedEvents = [...events].sort((a, b) => a.minute - b.minute);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-slate-800/20 dark:bg-slate-800/70 fixed inset-0" />
      <DialogContent className="max-w-6xl sm:max-w-3xl max-h-[95vh] w-[95vw]">
        <DialogHeader>
          <DialogTitle>Configure Match Timeline</DialogTitle>
          <DialogDescription>
            Set up your match timeline with team names, events, and match type.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="teamA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team A</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Team A name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teamB"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team B</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Team B name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="matchType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Match Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select match type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">
                          Standard (90 min)
                        </SelectItem>
                        <SelectItem value="extra-time">
                          Extra Time (120 min)
                        </SelectItem>
                        <SelectItem value="penalties">
                          Penalties (125 min)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Events</h3>
                <Badge variant="secondary">{sortedEvents.length} events</Badge>
              </div>

              {/* Add New Event */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Add New Event</CardTitle>
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
                        onClick={addEvent}
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
                      <label className="text-sm font-medium">
                        Metadata (JSON)
                      </label>
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

              {/* Events List */}
              <ScrollArea className="h-80">
                <div className="space-y-2">
                  {sortedEvents.map((event, index) => (
                    <Card key={index} className="p-3">
                      {editingEvent === index ? (
                        // Edit Mode
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {event.minute}'
                            </Badge>
                            <Badge
                              variant={
                                isConstantEvent(event.type)
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {EVENT_TYPES.find((t) => t.value === event.type)
                                ?.label || event.type}
                            </Badge>
                            {event.team && (
                              <Badge variant="outline" className="text-xs">
                                {event.team === "teamA" ? "Team A" : "Team B"}
                              </Badge>
                            )}
                            {event.player && (
                              <Badge variant="outline" className="text-xs">
                                {event.player}
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Description
                              </label>
                              <Textarea
                                value={editForm.description}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    description: e.target.value,
                                  })
                                }
                                className="min-h-[60px]"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Metadata (JSON)
                              </label>
                              <Textarea
                                value={editForm.metadata}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    metadata: e.target.value,
                                  })
                                }
                                className="min-h-[60px] font-mono text-xs"
                                placeholder='{"key": "value"}'
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={cancelEditing}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                            <Button type="button" size="sm" onClick={saveEdit}>
                              <Check className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {event.minute}'
                              </Badge>
                              <Badge
                                variant={
                                  isConstantEvent(event.type)
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {EVENT_TYPES.find((t) => t.value === event.type)
                                  ?.label || event.type}
                              </Badge>
                              {event.team && (
                                <Badge variant="outline" className="text-xs">
                                  {event.team === "teamA" ? "Team A" : "Team B"}
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm font-medium">
                              {event.description}
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              {event.player && (
                                <span>Player: {event.player}</span>
                              )}
                              {event.metadata &&
                                Object.keys(event.metadata).length > 0 && (
                                  <span className="font-mono">
                                    {Object.entries(event.metadata)
                                      .map(([key, value]) => `${key}: ${value}`)
                                      .join(", ")}
                                  </span>
                                )}
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditing(index)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            {!isConstantEvent(event.type) && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteEvent(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save Timeline
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
