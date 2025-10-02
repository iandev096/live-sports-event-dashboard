import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useClickAway } from "@uidotdev/usehooks";
import { Pause, Play, RotateCw, Settings, X } from "lucide-react";
import { useState } from "react";

interface SimulationFABProps {
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onReset?: () => void;
  onSettings?: () => void;
  className?: string;
  disabled?: boolean;
}

export function SimulationFAB({
  isPlaying = false,
  onPlayPause,
  onReset,
  onSettings,
  className,
  disabled = false,
}: SimulationFABProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useClickAway<HTMLDivElement>(() => {
    setIsExpanded(false);
  });

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePlayPause = () => {
    onPlayPause?.();
    setIsExpanded(false);
  };

  const handleReset = () => {
    onReset?.();
    setIsExpanded(false);
  };

  const handleSettings = () => {
    onSettings?.();
    setIsExpanded(false);
  };

  // Hide FAB completely in viewer mode (disabled state)
  if (disabled) {
    return null;
  }

  return (
    <div className={cn("fixed bottom-4 left-4 z-50", className)} ref={ref}>
      {/* Expanded Menu */}
      <div
        className={cn(
          "absolute bottom-16 left-0 flex flex-col gap-2 transition-all duration-300 ease-in-out",
          isExpanded
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-2 scale-95 pointer-events-none"
        )}
      >
        {/* Play/Pause Button */}
        <Button
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={handlePlayPause}
          disabled={disabled}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>

        {/* Reset Button */}
        <Button
          variant="secondary"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={handleReset}
          disabled={disabled}
        >
          <RotateCw className="h-5 w-5" />
        </Button>

        {/* Settings Button */}
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 dark:bg-slate-900/80 dark:hover:bg-slate-800"
          onClick={handleSettings}
          disabled={disabled}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Main FAB Button */}
      <Button
        variant="default"
        size="icon"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out",
          isExpanded && "rotate-45"
        )}
        onClick={handleToggle}
      >
        <div className="relative">
          <Play
            className={cn(
              "h-6 w-6 transition-all duration-300 ease-in-out",
              isExpanded ? "opacity-0 scale-0" : "opacity-100 scale-100"
            )}
          />
          <X
            className={cn(
              "h-6 w-6 absolute inset-0 transition-all duration-300 ease-in-out",
              isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-0"
            )}
          />
        </div>
      </Button>
    </div>
  );
}
