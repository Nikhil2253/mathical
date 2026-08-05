"use client";
import { getRecentSolvesAction } from "@/_actions_/solver.action";
import { HistoricSession } from "@/types/solver.types";
import { History, LogOut, Plus, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";

const TOPIC_COLORS = {
  sky: { bg: "bg-sky-light/60", text: "text-sky", border: "border-sky/30", solid: "bg-sky", glow: "shadow-sky/10" },
  violet: { bg: "bg-violet-light/60", text: "text-violet", border: "border-violet/30", solid: "bg-violet", glow: "shadow-violet/10" },
  success: { bg: "bg-success-light/60", text: "text-success", border: "border-success/30", solid: "bg-success", glow: "shadow-success/10" },
  secondary: { bg: "bg-secondary-light/60", text: "text-secondary-dark", border: "border-secondary/30", solid: "bg-secondary", glow: "shadow-secondary/10" },
  pink: { bg: "bg-pink-light/60", text: "text-pink", border: "border-pink/30", solid: "bg-pink", glow: "shadow-pink/10" },
  teal: { bg: "bg-teal-light/60", text: "text-teal", border: "border-teal/30", solid: "bg-teal", glow: "shadow-teal/10" },
  primary: { bg: "bg-primary-light/60", text: "text-primary", border: "border-primary/30", solid: "bg-primary", glow: "shadow-primary/10" },
} as const;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [history, setHistory] = useState<HistoricSession[]>([]);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  // Close the popup when clicking outside of it
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    Cookies.remove("mathical_access_token");
    Cookies.remove("mathical_current_user");
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFC] text-ink antialiased">
      <main className="flex-1 md:pr-64">{children}</main>
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

        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="w-full rounded-xl border border-border bg-subtle p-3 text-xs flex items-center gap-3 transition-colors hover:bg-sky-light/40"
          >
            <div className="h-8 w-8 rounded-full bg-sky/10 flex items-center justify-center font-mono font-medium text-sky">
              NS
            </div>
            <div>
              <p className="font-medium text-ink">Nikhil Saxena</p>
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-xl border border-border bg-white shadow-soft">
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  router.push("/settings");
                }}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-medium text-ink transition-colors hover:bg-subtle"
              >
                <Settings className="h-3.5 w-3.5 text-muted" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-medium text-emerald-300 transition-colors hover:bg-subtle"
              >
                <LogOut className="h-3.5 w-3.5 text-emerald-300" />
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}