import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChartColumn } from "lucide-react";

interface PollFABProps {
  onClick?: () => void;
  className?: string;
}

export function PollFAB({ onClick, className }: PollFABProps) {
  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      <Button
        variant="secondary"
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        onClick={onClick}
      >
        <ChartColumn className="h-6 w-6" />
      </Button>
    </div>
  );
}
