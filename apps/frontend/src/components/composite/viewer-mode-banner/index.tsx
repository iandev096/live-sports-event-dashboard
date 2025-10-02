import { useSimulation } from "@/components/providers/simulation-provider";
import { Button } from "@/components/ui/button";
import {
  clearMatchId,
  clearOriginalOwner,
  extractUserIdFromMatchId,
  generateMatchId,
  getUserId,
  isCurrentUserOriginalOwner,
  setViewingMode,
} from "@/lib/user-session";
import { Eye, Home, Lock } from "lucide-react";

function ViewerModeBanner() {
  const { isOwner, matchId, joinMatch } = useSimulation();

  if (isOwner) return null;

  const ownerId = extractUserIdFromMatchId(matchId);
  const canReturnToOwnerMode = isCurrentUserOriginalOwner();

  const handleGoToMySimulation = () => {
    // Only allow original owner to return
    if (!canReturnToOwnerMode) {
      console.warn("❌ You are not the original owner of this simulation");
      return;
    }

    console.log("🏠 Switching to my simulation");

    // Get current user ID and generate new match
    const userId = getUserId();
    const newMatchId = generateMatchId(userId);

    // Clear the viewed match ID and set to owner mode
    clearMatchId();
    clearOriginalOwner(); // Clear so new simulation can set it
    setViewingMode("owner");

    // Update URL without reload (SPA-friendly)
    window.history.pushState({}, "", window.location.pathname);

    // Join the new match as owner
    joinMatch(newMatchId);
  };

  return (
    <div className="bg-blue-500/10 dark:bg-blue-500/20 border-b border-blue-500/30 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Viewer Mode
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              You're watching {ownerId ? `${ownerId}'s` : "another user's"}{" "}
              simulation. Controls are disabled.
            </p>
          </div>
        </div>
        {canReturnToOwnerMode ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoToMySimulation}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Go to My Simulation
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="gap-2 opacity-50 cursor-not-allowed"
            title="You can only view this simulation. The owner must share their own simulation link."
          >
            <Lock className="h-4 w-4" />
            View Only
          </Button>
        )}
      </div>
    </div>
  );
}

export default ViewerModeBanner;
