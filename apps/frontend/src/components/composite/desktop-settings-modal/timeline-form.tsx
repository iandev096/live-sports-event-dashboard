import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";
import { EventsList } from "../shared/events-list";
import { NewEventForm } from "../shared/new-event-form";
import { TimelineFormGeneral } from "../shared/timeline-form-general";
import { type TimelineFormProps } from "../shared/timeline-form-types";
import { useTimelineForm } from "../shared/useTimelineForm";

export function TimelineForm({
  initialTimeline,
  onSave,
  onCancel,
}: TimelineFormProps) {
  const {
    form,
    sortedEvents,
    newEvent,
    setNewEvent,
    editingEvent,
    editForm,
    setEditForm,
    isConstantEvent,
    addEvent,
    deleteEvent,
    startEditing,
    cancelEditing,
    saveEdit,
    handleSave,
  } = useTimelineForm({ initialTimeline, onSave });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
        <TimelineFormGeneral.Desktop form={form} />

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Events</h3>
            <Badge variant="secondary">{sortedEvents.length} events</Badge>
          </div>

          {/* Add New Event */}
          <NewEventForm.Desktop
            newEvent={newEvent}
            setNewEvent={setNewEvent}
            onAddEvent={addEvent}
          />

          {/* Events List */}
          <EventsList.Desktop
            events={sortedEvents}
            editingEvent={editingEvent}
            editForm={editForm}
            setEditForm={setEditForm}
            isConstantEvent={isConstantEvent}
            onSave={saveEdit}
            onCancel={cancelEditing}
            onEdit={startEditing}
            onDelete={deleteEvent}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Save Timeline
          </Button>
        </div>
      </form>
    </Form>
  );
}
