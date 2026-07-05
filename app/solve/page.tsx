"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Shapes,
  ShieldCheck,
  Target,
  Camera,
  History,
  Plus,
  Send,
  RefreshCw,
  Sigma,
  AlertTriangle,
} from "lucide-react";

import { getRecentSolvesAction, solverAction } from "@/_actions_/solver.action";
import type { HistoricSession, TopicColor } from "@/types/solver.types";

const TOPIC_COLORS = {
  sky: { bg: "bg-sky-light/60", text: "text-sky", border: "border-sky/30", solid: "bg-sky", glow: "shadow-sky/10" },
  violet: { bg: "bg-violet-light/60", text: "text-violet", border: "border-violet/30", solid: "bg-violet", glow: "shadow-violet/10" },
  success: { bg: "bg-success-light/60", text: "text-success", border: "border-success/30", solid: "bg-success", glow: "shadow-success/10" },
  secondary: { bg: "bg-secondary-light/60", text: "text-secondary-dark", border: "border-secondary/30", solid: "bg-secondary", glow: "shadow-secondary/10" },
  pink: { bg: "bg-pink-light/60", text: "text-pink", border: "border-pink/30", solid: "bg-pink", glow: "shadow-pink/10" },
  teal: { bg: "bg-teal-light/60", text: "text-teal", border: "border-teal/30", solid: "bg-teal", glow: "shadow-teal/10" },
  primary: { bg: "bg-primary-light/60", text: "text-primary", border: "border-primary/30", solid: "bg-primary", glow: "shadow-primary/10" },
} as const;

export default function SolvePage() {
  const router = useRouter();
  const [inputQuery, setInputQuery] = useState("∫ 2x²eˣ dx");
  const [isSolving, setIsSolving] = useState(false);
  const [solveError, setSolveError] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoricSession[]>([]);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getRecentSolvesAction()
      .then((sessions) => {
        if (!cancelled) setHistory(sessions);
      })
      .catch((err) => {
        if (!cancelled) setHistoryError(err instanceof Error ? err.message : "Failed to load history.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const triggerSolve = async () => {
    if (!inputQuery.trim() || isSolving) return;

    setIsSolving(true);
    setSolveError(null);

    try {
      const result = await solverAction(inputQuery);
      router.push(`/solve/${result.id}`);
    } catch (err) {
      setSolveError(err instanceof Error ? err.message : "Something went wrong while solving.");
      setIsSolving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFC] text-ink antialiased">
      <main className="flex-1 md:pr-64">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8 space-y-6">

          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-softer">
            <div className="flex items-center gap-2 border-b border-border bg-subtle px-4 py-2 text-xs text-muted font-mono justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="ml-2">mathical solve</span>
              </div>
              <div className="flex items-center gap-2">
                <ChipAccent color="violet">Mathical</ChipAccent>
              </div>
            </div>

            <div className="relative flex items-center p-4">
              <span className="font-mono text-primary text-lg select-none mr-3">›</span>
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Type complex equations, LaTeX strings or paste proof statements..."
                className="w-full font-mono text-sm text-ink placeholder:text-muted focus:outline-none"
                onKeyDown={(e) => e.key === "Enter" && triggerSolve()}
              />
              <div className="flex items-center gap-1.5 ml-2">
                <button className="p-2 rounded-xl border border-border bg-white text-ink-soft hover:text-ink transition-colors" title="Snap homework image">
                  <Camera className="h-4 w-4" />
                </button>
                <button
                  onClick={triggerSolve}
                  disabled={isSolving}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-sky px-4 text-xs font-medium text-white shadow-soft transition-all hover:bg-primary-dark disabled:opacity-60"
                >
                  {isSolving ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>Solve <Send className="h-3 w-3" /></>
                  )}
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isSolving && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2.5 rounded-2xl border border-border bg-white py-14 text-sm text-ink-soft shadow-softer"
              >
                <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                Running the solver…
              </motion.div>
            )}

            {!isSolving && solveError && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2.5 rounded-2xl border border-pink/30 bg-pink-light/25 px-5 py-4 text-sm text-pink"
              >
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {solveError}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      <aside className="fixed inset-y-0 right-0 z-20 hidden w-64 border-l border-border bg-white p-5 md:flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 px-1">
                  <img src="/mathical-logo.png" className="h-15 w-full" />
                </div>
      
                <button
                  onClick={() => router.push("/solve")}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary  to-sky px-4 py-2.5 text-xs font-medium text-white shadow-soft transition-all hover:bg-primary-dark"
                >
                  <Plus className="h-3.5 w-3.5" /> New Problem Canvas
                </button>
      
                <div>
                  <div className="flex items-center gap-1.5 px-1 mb-2 text-[11px] font-mono uppercase tracking-wider text-muted">
                    <History className="h-3 w-3" /> Recent Solves
                  </div>
                  <div className="space-y-1">
                    {historyError && (
                      <p className="px-3 py-2 text-[11px] text-pink">{historyError}</p>
                    )}
                    {history.map((session) => {
                      const c = TOPIC_COLORS[session.color] ?? TOPIC_COLORS.primary;
                      return (
                        <button
                          key={session.id}
                          onClick={() => router.push(`/solve/${session.id}`)}
                          className={`flex w-full flex-row-reverse gap-2 items-center justify-end rounded-xl border-2 border-sky-50 px-3 py-2.5 text-left text-xs transition-colors hover:bg-subtle`}
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
                <div className="h-8 w-8 rounded-full bg-sky/10 flex items-center justify-center font-mono font-medium text-sky">
                  NS
                </div>
                <div>
                  <p className="font-medium text-ink">Nikhil Saxena</p>
                </div>
              </div>
            </aside>
    </div>
  );
}

function ChipAccent({ children, color = "primary" }: { children: React.ReactNode; color?: TopicColor }) {
  const c = TOPIC_COLORS[color] ?? TOPIC_COLORS.primary;

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-mono ${c.border} ${c.bg} ${c.text}`}>
      {children}
    </span>
  );
}