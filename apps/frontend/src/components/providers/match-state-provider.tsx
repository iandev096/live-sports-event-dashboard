import type { MatchState } from "@repo/shared-types";
import { createContext, useContext, useMemo, useState } from "react";

interface MatchStateContextType {
  matchState: MatchState | null;
  isSimulationRunning: boolean;
  setMatchState: React.Dispatch<React.SetStateAction<MatchState | null>>;
  setIsSimulationRunning: React.Dispatch<React.SetStateAction<boolean>>;
}

const MatchStateContext = createContext<MatchStateContextType | undefined>(
  undefined
);

export const useMatchState = () => {
  const context = useContext(MatchStateContext);
  if (!context) {
    throw new Error("useMatchState must be used within a MatchStateProvider");
  }
  return context;
};

interface MatchStateProviderProps {
  children: React.ReactNode;
}

export const MatchStateProvider = ({ children }: MatchStateProviderProps) => {
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  // Memoize context value - only updates when matchState or isSimulationRunning change
  const contextValue = useMemo(
    () => ({
      matchState,
      isSimulationRunning,
      setMatchState,
      setIsSimulationRunning,
    }),
    [matchState, isSimulationRunning]
  );

  return (
    <MatchStateContext.Provider value={contextValue}>
      {children}
    </MatchStateContext.Provider>
  );
};
