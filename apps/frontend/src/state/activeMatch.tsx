import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ActiveMatch = {
  id: string | null;
  teamA?: string;
  teamB?: string;
};

type ActiveMatchContextValue = {
  active: ActiveMatch;
  setActive: (value: ActiveMatch) => void;
};

const ActiveMatchContext = createContext<ActiveMatchContextValue | undefined>(
  undefined
);

export function ActiveMatchProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ActiveMatch>({ id: null });
  const value = useMemo(() => ({ active, setActive }), [active]);
  return (
    <ActiveMatchContext.Provider value={value}>
      {children}
    </ActiveMatchContext.Provider>
  );
}

export function useActiveMatch() {
  const ctx = useContext(ActiveMatchContext);
  if (!ctx)
    throw new Error("useActiveMatch must be used within ActiveMatchProvider");
  return ctx;
}
