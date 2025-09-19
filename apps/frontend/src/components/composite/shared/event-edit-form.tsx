import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { MatchEvent } from "@/types";
import { Check, X } from "lucide-react";
import { EVENT_TYPES } from "./timeline-form-types";

interface EventEditFormProps {
  event: MatchEvent;
  editForm: {
    description: string;
    metadata: string;
  };
  setEditForm: (form: { description: string; metadata: string }) => void;
  isConstantEvent: (eventType: string) => boolean;
  onSave: () => void;
  onCancel: () => void;
}

// Desktop version
function DesktopEventEditForm({
  event,
  editForm,
  setEditForm,
  isConstantEvent,
  onSave,
  onCancel,
}: EventEditFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="text-xs">
          {event.minute}'
        </Badge>
        <Badge
          variant={isConstantEvent(event.type) ? "default" : "secondary"}
          className="text-xs"
        >
          {EVENT_TYPES.find((t) => t.value === event.type)?.label || event.type}
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
          <label className="text-sm font-medium">Description</label>
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
          <label className="text-sm font-medium">Metadata (JSON)</label>
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
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="button" size="sm" onClick={onSave}>
          <Check className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
}

// Mobile version
function MobileEventEditForm({
  event,
  editForm,
  setEditForm,
  isConstantEvent,
  onSave,
  onCancel,
}: EventEditFormProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="text-xs">
          {event.minute}'
        </Badge>
        <Badge
          variant={isConstantEvent(event.type) ? "default" : "secondary"}
          className="text-xs"
        >
          {EVENT_TYPES.find((t) => t.value === event.type)?.label || event.type}
        </Badge>
      </div>

      <div className="space-y-2">
        <div>
          <label className="text-xs font-medium">Description</label>
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
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="h-3 w-3 mr-1" />
          Cancel
        </Button>
        <Button type="button" size="sm" onClick={onSave}>
          <Check className="h-3 w-3 mr-1" />
          Save
        </Button>
      </div>
    </div>
  );
}

// Compound component
export const EventEditForm = {
  Desktop: DesktopEventEditForm,
  Mobile: MobileEventEditForm,
};
