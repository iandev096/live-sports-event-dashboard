import { useActions } from "@/components/providers/actions-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";

interface ShareSimulationButtonProps {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  onCopySuccess?: () => void;
}

function ShareSimulationButton({
  variant = "outline",
  size = "default",
  onCopySuccess,
}: ShareSimulationButtonProps) {
  const { isOwner, shareableUrl, copyShareLink } = useActions();
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  if (!isOwner) return null;

  const handleCopy = async () => {
    try {
      await copyShareLink();
      setCopied(true);
      onCopySuccess?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Share2 className="h-4 w-4" />
          {size !== "icon" && <span className="hidden md:inline">Share</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Simulation</DialogTitle>
          <DialogDescription>
            Anyone with this link can view your live simulation. They won't be
            able to control it.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareableUrl}
              className="flex-1 px-3 py-2 text-sm border rounded-md bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
            />
            <Button
              size="sm"
              onClick={handleCopy}
              className="gap-2"
              variant={copied ? "default" : "outline"}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            <p>
              💡 Tip: Share this link with friends so they can watch your match
              simulation in real-time!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShareSimulationButton;
