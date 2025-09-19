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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockMatchTimeline } from "@/mock/match-timeline";
import { ArrowLeft, ArrowRight, List, Plus, Save, Users } from "lucide-react";
import { useState } from "react";
import { EventEditForm } from "../shared/event-edit-form";
import { EventView } from "../shared/event-view";
import { NewEventForm } from "../shared/new-event-form";
import { type TimelineFormProps } from "../shared/timeline-form-types";
import { useTimelineForm } from "../shared/useTimelineForm";

interface MobileTimelineFormProps extends TimelineFormProps {}

export function MobileTimelineForm({
  initialTimeline,
  onSave,
  onCancel,
}: MobileTimelineFormProps) {
  const [activeTab, setActiveTab] = useState("general");

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
  } = useTimelineForm({
    initialTimeline: initialTimeline || mockMatchTimeline,
    onSave,
  });

  const nextTab = () => {
    if (activeTab === "general") setActiveTab("add-events");
    else if (activeTab === "add-events") setActiveTab("manage-events");
  };

  const prevTab = () => {
    if (activeTab === "manage-events") setActiveTab("add-events");
    else if (activeTab === "add-events") setActiveTab("general");
  };

  return (
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
              <div className="mb-4">
                <NewEventForm.Mobile
                  newEvent={newEvent}
                  setNewEvent={setNewEvent}
                  onAddEvent={addEvent}
                />
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

                <ScrollArea className="h-104">
                  <div className="space-y-2">
                    {sortedEvents.map((event, index) => (
                      <Card key={index} className="p-3">
                        {editingEvent === index ? (
                          <EventEditForm.Mobile
                            event={event}
                            editForm={editForm}
                            setEditForm={setEditForm}
                            isConstantEvent={isConstantEvent}
                            onSave={saveEdit}
                            onCancel={cancelEditing}
                          />
                        ) : (
                          <EventView.Mobile
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
            </TabsContent>
          </div>
        </Tabs>

        <div className="p-6 pt-0 flex gap-2 transition-all duration-300 ease-in-out">
          {activeTab === "general" && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
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
        </div>
      </form>
    </Form>
  );
}
