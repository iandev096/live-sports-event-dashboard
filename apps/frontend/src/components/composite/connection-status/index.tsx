import { useSocket } from "@/components/providers/socket-provider";
import { cn } from "@/lib/utils";
import { Wifi, WifiOff } from "lucide-react";

interface ConnectionStatusProps {
  className?: string;
  showText?: boolean;
}

function ConnectionStatus({
  className,
  showText = true,
}: ConnectionStatusProps) {
  const { isConnected } = useSocket();

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm",
        isConnected
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400",
        className
      )}
      title={isConnected ? "Connected to server" : "Disconnected from server"}
    >
      {isConnected ? (
        <Wifi className="h-4 w-4" />
      ) : (
        <WifiOff className="h-4 w-4 animate-pulse" />
      )}
      {showText && (
        <span className="text-xs font-medium">
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      )}
    </div>
  );
}

export default ConnectionStatus;
