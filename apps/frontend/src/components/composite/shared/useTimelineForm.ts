import type { EventType, MatchEvent, MatchTimeline } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  CONSTANT_EVENTS,
  timelineSchema,
  type TimelineFormData,
} from "./timeline-form-types";

interface UseTimelineFormProps {
  initialTimeline?: MatchTimeline;
  onSave: (timeline: MatchTimeline) => void;
}

export function useTimelineForm({
  initialTimeline,
  onSave,
}: UseTimelineFormProps) {
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
    const sortedEvents = [...events].sort((a, b) => a.minute - b.minute);
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
  };

  return {
    // Form state
    form,
    events,
    sortedEvents: [...events].sort((a, b) => a.minute - b.minute),
    watchMatchType,

    // New event state
    newEvent,
    setNewEvent,

    // Edit state
    editingEvent,
    editForm,
    setEditForm,

    // Utility functions
    isConstantEvent,
    addEvent,
    deleteEvent,
    startEditing,
    cancelEditing,
    saveEdit,
    handleSave,
  };
}
