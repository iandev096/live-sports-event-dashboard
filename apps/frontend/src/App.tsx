import Dashboard from "./components/composite/dashboard";
import { ActionsProvider } from "./components/providers/actions-provider";
import { EventsProvider } from "./components/providers/events-provider";
import { MatchStateProvider } from "./components/providers/match-state-provider";
import { SimulationCoordinator } from "./components/providers/simulation-coordinator";
import { SocketProvider } from "./components/providers/socket-provider";
import { ThemeProvider } from "./components/providers/theme-provider";
import {
  clearMatchId,
  createShareableUrl,
  generateMatchId,
  getMatchId,
  getMatchIdFromUrl,
  getUserId,
  isMatchOwner,
  isViewerModeFromUrl,
  setMatchId,
  setViewingMode,
} from "./lib/user-session";

// Initialize session data
const userId = getUserId();

// Initialize match ID from URL or localStorage
const initializeMatchId = (): string => {
  const urlMatchId = getMatchIdFromUrl();
  if (urlMatchId) {
    setMatchId(urlMatchId); // Save to localStorage
    return urlMatchId;
  }

  // Check if we have a stored match ID
  const storedMatchId = getMatchId();

  // If stored match ID doesn't belong to current user, clear it and create new one
  if (!isMatchOwner(storedMatchId, userId)) {
    clearMatchId();
    return generateMatchId(userId);
  }

  return storedMatchId;
};

// Determine if user is owner or viewer
const initializeIsOwner = (): boolean => {
  // If URL explicitly says viewer mode, honor it
  if (isViewerModeFromUrl()) {
    setViewingMode("viewer");
    return false;
  }

  // Otherwise, always owner for their own match
  setViewingMode("owner");
  return true;
};

const initialMatchId = initializeMatchId();
const initialIsOwner = initializeIsOwner();
const initialShareableUrl = createShareableUrl(initialMatchId);

function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        {/* MatchStateProvider: Time-sensitive data (matchState, isSimulationRunning) */}
        <MatchStateProvider>
          {/* EventsProvider: Event and poll data */}
          <EventsProvider>
            {/* ActionsProvider: All action functions */}
            <ActionsProvider
              initialMatchId={initialMatchId}
              initialIsOwner={initialIsOwner}
              initialShareableUrl={initialShareableUrl}
            >
              {/* SimulationCoordinator: Handles socket events and updates contexts */}
              <SimulationCoordinator>
                <Dashboard />
              </SimulationCoordinator>
            </ActionsProvider>
          </EventsProvider>
        </MatchStateProvider>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;
