import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MatchTimeline } from "@/types";
import { DialogOverlay } from "@radix-ui/react-dialog";
import { Settings } from "lucide-react";
import { MobileTimelineForm } from "./mobile-timeline-form";

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
  const handleSave = (timeline: MatchTimeline) => {
    onSave(timeline);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-slate-800/20 dark:bg-slate-800/70 fixed inset-0" />
      <DialogContent className="max-w-md xs:mx-4 w-[calc(100vw-2rem)] p-0 overflow-hidden transition-all duration-300 ease-in-out h-[675px] grid-rows-[auto_1fr_auto]">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Match Settings
          </DialogTitle>
          <DialogDescription className="text-sm sr-only">
            Configure your match timeline and events
          </DialogDescription>
        </DialogHeader>

        <MobileTimelineForm
          initialTimeline={initialTimeline}
          onSave={handleSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
