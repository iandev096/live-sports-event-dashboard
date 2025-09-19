import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MatchEvent } from "@/types";
import { EventEditForm } from "./event-edit-form";
import { EventView } from "./event-view";

interface EventsListProps {
  events: MatchEvent[];
  editingEvent: number | null;
  editForm: {
    description: string;
    metadata: string;
  };
  setEditForm: (form: { description: string; metadata: string }) => void;
  isConstantEvent: (eventType: string) => boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

// Desktop version
function DesktopEventsList({
  events,
  editingEvent,
  editForm,
  setEditForm,
  isConstantEvent,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: EventsListProps) {
  return (
    <ScrollArea className="h-80 rounded-md">
      <div className="space-y-2">
        {events.map((event, index) => (
          <Card key={index} className="p-3">
            {editingEvent === index ? (
              <EventEditForm.Desktop
                event={event}
                editForm={editForm}
                setEditForm={setEditForm}
                isConstantEvent={isConstantEvent}
                onSave={onSave}
                onCancel={onCancel}
              />
            ) : (
              <EventView.Desktop
                event={event}
                isConstantEvent={isConstantEvent}
                onEdit={() => onEdit(index)}
                onDelete={() => onDelete(index)}
              />
            )}
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

// Mobile version
function MobileEventsList({
  events,
  editingEvent,
  editForm,
  setEditForm,
  isConstantEvent,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: EventsListProps) {
  return (
    <ScrollArea className="h-104 rounded-md">
      <div className="space-y-2">
        {events.map((event, index) => (
          <Card key={index} className="p-3">
            {editingEvent === index ? (
              <EventEditForm.Mobile
                event={event}
                editForm={editForm}
                setEditForm={setEditForm}
                isConstantEvent={isConstantEvent}
                onSave={onSave}
                onCancel={onCancel}
              />
            ) : (
              <EventView.Mobile
                event={event}
                isConstantEvent={isConstantEvent}
                onEdit={() => onEdit(index)}
                onDelete={() => onDelete(index)}
              />
            )}
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

// Compound component
export const EventsList = {
  Desktop: DesktopEventsList,
  Mobile: MobileEventsList,
};
