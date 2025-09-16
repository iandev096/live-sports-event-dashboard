import { useQuery } from "@tanstack/react-query";
import { api } from "../../data/client";

type ApiResponse<T> = { status: string; data: T };

export function StatsPanel() {
  const { data: match } = useQuery({
    queryKey: ["live-match"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<any[]>>("/matches/live");
      return res.data?.[0];
    },
    refetchInterval: 15000,
  });

  // Placeholder stats based on available data; real app would have detailed stats
  const stats = [
    { label: "Possession", value: "52% - 48%" },
    { label: "Shots on Goal", value: "5 - 4" },
    { label: "Yellow Cards", value: "1 - 2" },
    { label: "Corners", value: "4 - 3" },
  ];

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold">Match Stats</h2>
      {match ? (
        <div className="grid grid-cols-1 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
            >
              <span className="text-sm text-[--color-textSecondary]">
                {s.label}
              </span>
              <span className="text-sm font-medium">{s.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-[--color-textSecondary]">
          No live match
        </div>
      )}
    </div>
  );
}
