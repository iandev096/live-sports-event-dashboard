import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockMatchTimeline } from "@/mock/match-timeline";
import { ArrowLeft, ArrowRight, List, Plus, Save, Users } from "lucide-react";
import { useState } from "react";
import { EventsList } from "../shared/events-list";
import { NewEventForm } from "../shared/new-event-form";
import { TimelineFormGeneral } from "../shared/timeline-form-general";
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
                <TimelineFormGeneral.Mobile form={form} />
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

                <EventsList.Mobile
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
