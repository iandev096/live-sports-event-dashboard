import type { MatchEvent, Poll } from "@repo/shared-types";
import { createContext, useContext, useMemo, useState } from "react";

interface EventsContextType {
  events: MatchEvent[];
  poll: Poll | null;
  hasVoted: boolean;
  userVote: string | null;
  setEvents: React.Dispatch<React.SetStateAction<MatchEvent[]>>;
  setPoll: React.Dispatch<React.SetStateAction<Poll | null>>;
  setHasVoted: React.Dispatch<React.SetStateAction<boolean>>;
  setUserVote: React.Dispatch<React.SetStateAction<string | null>>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
};

interface EventsProviderProps {
  children: React.ReactNode;
}

export const EventsProvider = ({ children }: EventsProviderProps) => {
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState<string | null>(null);

  // Memoize context value - only updates when events or poll data changes
  const contextValue = useMemo(
    () => ({
      events,
      poll,
      hasVoted,
      userVote,
      setEvents,
      setPoll,
      setHasVoted,
      setUserVote,
    }),
    [events, poll, hasVoted, userVote]
  );

  return (
    <EventsContext.Provider value={contextValue}>
      {children}
    </EventsContext.Provider>
  );
};
