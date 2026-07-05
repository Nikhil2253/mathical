"use client";

import { useRouter } from "next/navigation";
import { History, Plus } from "lucide-react";
import type { HistoricSession, TopicColor } from "@/types/solver.types";

const TOPIC_COLORS = {
  sky: { solid: "bg-sky" },
  violet: { solid: "bg-violet" },
  success: { solid: "bg-success" },
  secondary: { solid: "bg-secondary" },
  pink: { solid: "bg-pink" },
  teal: { solid: "bg-teal" },
  primary: { solid: "bg-primary" },
} as const satisfies Record<TopicColor, { solid: string }>;

export default function SolveSidebar({
  history,
  historyError,
}: {
  history: HistoricSession[];
  historyError?: string | null;
}) {
  const router = useRouter();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-border bg-white p-5 md:flex flex-col justify-between">
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 px-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-violet to-pink text-white">
            <span className="font-mono text-sm">Σ</span>
          </span>
          <span className="text-base font-semibold tracking-tight text-ink">Mathical Workspace</span>
        </div>

        <button
          onClick={() => router.push("/solve")}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-primary  to-sky px-4 py-2.5 text-xs font-medium text-white shadow-soft transition-all hover:bg-primary-dark"
        >
          <Plus className="h-3.5 w-3.5" /> New Problem Canvas
        </button>

        <div>
          <div className="flex items-center gap-1.5 px-1 mb-2 text-[11px] font-mono uppercase tracking-wider text-muted">
            <History className="h-3 w-3" /> Recent Derivations
          </div>
          <div className="space-y-1">
            {historyError && <p className="px-3 py-2 text-[11px] text-pink">{historyError}</p>}
            {history.map((session) => {
              const c = TOPIC_COLORS[session.color];
              return (
                <button
                  key={session.id}
                  onClick={() => router.push(`/solve/${session.id}`)}
                  className="flex w-full flex-col items-start gap-1 rounded-xl px-3 py-2.5 text-left text-xs transition-colors hover:bg-subtle"
                >
                  <span className="font-mono text-ink line-clamp-1">{session.question}</span>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${c.solid}`} />
                    <span className="text-[10px] text-ink-soft">{session.topic}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-subtle p-3 text-xs flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-violet/20 to-pink/20 flex items-center justify-center font-mono font-medium text-violet">
          NS
        </div>
        <div>
          <p className="font-medium text-ink">Nikhil Saxena</p>
          <p className="text-[10px] text-ink-soft">Tier: Advanced Tier</p>
        </div>
      </div>
    </aside>
  );
}