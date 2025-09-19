import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Save } from "lucide-react";
import { EventEditForm } from "../shared/event-edit-form";
import { EventView } from "../shared/event-view";
import { NewEventForm } from "../shared/new-event-form";
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
                    <SelectItem value="standard">Standard (90 min)</SelectItem>
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
          <NewEventForm.Desktop
            newEvent={newEvent}
            setNewEvent={setNewEvent}
            onAddEvent={addEvent}
          />

          {/* Events List */}
          <ScrollArea className="h-80">
            <div className="space-y-2">
              {sortedEvents.map((event, index) => (
                <Card key={index} className="p-3">
                  {editingEvent === index ? (
                    <EventEditForm.Desktop
                      event={event}
                      editForm={editForm}
                      setEditForm={setEditForm}
                      isConstantEvent={isConstantEvent}
                      onSave={saveEdit}
                      onCancel={cancelEditing}
                    />
                  ) : (
                    <EventView.Desktop
                      event={event}
                      isConstantEvent={isConstantEvent}
                      onEdit={() => startEditing(index)}
                      onDelete={() => deleteEvent(index)}
                    />
                  )}
                </Card>
              ))}
            </div>
          </ScrollArea>
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
