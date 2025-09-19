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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { mockMatchTimeline } from "@/mock/match-timeline";
import type { EventType, MatchEvent, MatchTimeline } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogOverlay } from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Edit2,
  List,
  Plus,
  Save,
  Settings,
  Trash2,
  Users,
  X,
} from "lucide-react";
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
  description: z.string().min(1, "Description is required"),
  team: z.enum(["teamA", "teamB"]).optional(),
  player: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

const timelineSchema = z.object({
  matchId: z.string().min(1, "Match ID is required"),
  teamA: z.string().min(1, "Team A name is required"),
  teamB: z.string().min(1, "Team B name is required"),
  matchType: z.enum(["standard", "extra-time", "penalties"]),
  events: z.array(eventSchema),
});

type TimelineFormData = z.infer<typeof timelineSchema>;

const EVENT_TYPES = [
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
  "extra-time": ["kickoff", "half-time", "full-time", "extra-time"],
  penalties: ["kickoff", "half-time", "full-time", "extra-time", "penalties"],
};

interface MobileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (timeline: MatchTimeline) => void;
  initialTimeline?: MatchTimeline;
}

export function MobileSettingsModal({
  isOpen,
  onClose,
  onSave,
  initialTimeline,
}: MobileSettingsModalProps) {
  const [activeTab, setActiveTab] = useState("general");
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

  // Event utilities are available if needed for future enhancements

  const form = useForm<TimelineFormData>({
    resolver: zodResolver(timelineSchema),
    defaultValues: {
      matchId: initialTimeline?.matchId || mockMatchTimeline.matchId,
      teamA: initialTimeline?.teamA || mockMatchTimeline.teamA,
      teamB: initialTimeline?.teamB || mockMatchTimeline.teamB,
      matchType: "standard",
      events: initialTimeline?.events || mockMatchTimeline.events,
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

  const nextTab = () => {
    if (activeTab === "general") setActiveTab("add-events");
    else if (activeTab === "add-events") setActiveTab("manage-events");
  };

  const prevTab = () => {
    if (activeTab === "manage-events") setActiveTab("add-events");
    else if (activeTab === "add-events") setActiveTab("general");
  };

  // Get dynamic height based on active tab
  const getModalHeight = () => {
    switch (activeTab) {
      case "general":
        return "h-[500px]"; // Smaller height for general tab
      case "add-events":
        return "h-[780px]"; // Medium height for add events tab
      case "manage-events":
        return "h-[600px]"; // Larger height for manage events tab
      default:
        return "h-[400px]";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-slate-800/20 dark:bg-slate-800/70 fixed inset-0" />
      <DialogContent
        className={`max-w-md xs:mx-4 w-[calc(100vw-2rem)] p-0 overflow-hidden transition-all duration-300 ease-in-out ${getModalHeight()} grid-rows-[auto_1fr_auto]`}
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Match Settings
          </DialogTitle>
          <DialogDescription className="text-sm sr-only">
            Configure your match timeline and events
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSave)}
            className="flex flex-col h-full"
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col px-4"
            >
              <TabsList className="grid w-full grid-cols-3 mb-4 transition-all duration-200 ease-in-out">
                <TabsTrigger
                  value="general"
                  className="flex items-center gap-1 text-xs transition-all duration-200 ease-in-out data-[state=active]:scale-105"
                >
                  <Users className="h-3 w-3" />
                  <span className="hidden sm:inline">General</span>
                </TabsTrigger>
                <TabsTrigger
                  value="add-events"
                  className="flex items-center gap-1 text-xs transition-all duration-200 ease-in-out data-[state=active]:scale-105"
                >
                  <Plus className="h-3 w-3" />
                  <span className="hidden sm:inline">Add Events</span>
                </TabsTrigger>
                <TabsTrigger
                  value="manage-events"
                  className="flex items-center gap-1 text-xs transition-all duration-200 ease-in-out data-[state=active]:scale-105"
                >
                  <List className="h-3 w-3" />
                  <span className="hidden sm:inline">Manage</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden">
                <TabsContent
                  value="general"
                  className="h-full m-0 p-2 pt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-right-1/2 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:slide-out-to-left-1/2 transition-all duration-300 ease-in-out"
                >
                  <div className="space-y-4">
                    <div className="space-y-4">
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
                  </div>
                </TabsContent>

                <TabsContent
                  value="add-events"
                  className="h-full m-0 p-2 pt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-right-1/2 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:slide-out-to-left-1/2 transition-all duration-300 ease-in-out"
                >
                  <div className="space-y-4">
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
                            <label className="text-xs font-medium mb-1 block">
                              Minute
                            </label>
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
                            <label className="text-xs font-medium mb-1 block">
                              Team
                            </label>
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
                          <label className="text-xs font-medium mb-1 block">
                            Event Type
                          </label>
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
                          <label className="text-xs font-medium mb-1 block">
                            Description
                          </label>
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
                          onClick={addEvent}
                          size="sm"
                          className="w-full"
                          disabled={!newEvent.description || !newEvent.type}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Event
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent
                  value="manage-events"
                  className="h-full m-0 p-2 pt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-right-1/2 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:slide-out-to-left-1/2 transition-all duration-300 ease-in-out"
                >
                  <div className="space-y-4 h-full flex flex-col">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">
                        Events ({sortedEvents.length})
                      </h3>
                    </div>

                    <ScrollArea className="h-72">
                      <div className="space-y-2">
                        {sortedEvents.map((event, index) => (
                          <Card key={index} className="p-3">
                            {editingEvent === index ? (
                              // Edit Mode
                              <div className="space-y-3">
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
                                    {EVENT_TYPES.find(
                                      (t) => t.value === event.type
                                    )?.label || event.type}
                                  </Badge>
                                </div>
                                <div className="space-y-2">
                                  <div>
                                    <label className="text-xs font-medium">
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
                                      className="min-h-[50px] text-sm"
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
                                    <X className="h-3 w-3 mr-1" />
                                    Cancel
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={saveEdit}
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Save
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              // View Mode
                              <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
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
                                      {EVENT_TYPES.find(
                                        (t) => t.value === event.type
                                      )?.label || event.type}
                                    </Badge>
                                    {event.team && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {event.team === "teamA"
                                          ? "Team A"
                                          : "Team B"}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm font-medium">
                                    {event.description}
                                  </div>
                                  {event.player && (
                                    <div className="text-xs text-muted-foreground">
                                      Player: {event.player}
                                    </div>
                                  )}
                                </div>
                                <div className="flex space-x-1 ml-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => startEditing(index)}
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </Button>
                                  {!isConstantEvent(event.type) && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteEvent(index)}
                                    >
                                      <Trash2 className="h-3 w-3" />
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
                </TabsContent>
              </div>
            </Tabs>

            <DialogFooter className="p-6 pt-0 flex gap-2 transition-all duration-300 ease-in-out">
              {activeTab === "general" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 transition-all duration-200 ease-in-out"
                >
                  Cancel
                </Button>
              )}
              {activeTab === "general" && (
                <Button
                  type="button"
                  onClick={nextTab}
                  className="flex-1 transition-all duration-200 ease-in-out"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
              {activeTab === "add-events" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevTab}
                  className="flex-1 transition-all duration-200 ease-in-out"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              {activeTab === "add-events" && (
                <Button
                  type="button"
                  onClick={nextTab}
                  className="flex-1 transition-all duration-200 ease-in-out"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
              {activeTab === "manage-events" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevTab}
                  className="flex-1 transition-all duration-200 ease-in-out"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              {activeTab === "manage-events" && (
                <Button
                  type="submit"
                  className="flex-1 transition-all duration-200 ease-in-out"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
