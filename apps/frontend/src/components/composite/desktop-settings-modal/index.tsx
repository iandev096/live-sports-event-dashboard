import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MatchTimeline } from "@/types";
import { DialogOverlay } from "@radix-ui/react-dialog";
import { TimelineForm } from "./timeline-form";

interface DesktopSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (timeline: MatchTimeline) => void;
  initialTimeline?: MatchTimeline;
}

export function DesktopSettingsModal({
  isOpen,
  onClose,
  onSave,
  initialTimeline,
}: DesktopSettingsModalProps) {
  const handleSave = (timeline: MatchTimeline) => {
    onSave(timeline);
    onClose();
  };

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

        <TimelineForm
          initialTimeline={initialTimeline}
          onSave={handleSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
