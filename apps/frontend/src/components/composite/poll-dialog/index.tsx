import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Poll } from "@/types";
import ActivePoll from "../active-poll";

interface PollDialogProps {
  isOpen: boolean;
  onClose: () => void;
  poll: Poll;
  onVote?: (optionId: string) => void;
  hasVoted?: boolean;
  userVote?: string;
}

export function PollDialog({
  isOpen,
  onClose,
  poll,
  onVote,
  hasVoted = false,
  userVote,
}: PollDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 max-h-[90vh] w-[calc(100vw-2rem)] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-lg font-semibold">Live Poll</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-4">
          <ActivePoll
            poll={poll}
            onVote={onVote}
            hasVoted={hasVoted}
            userVote={userVote}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
