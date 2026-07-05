"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Shapes,
  ShieldCheck,
  Target,
  ChevronRight,
  History,
  Plus,
  RefreshCw,
  Sigma,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  ExternalLink,
  Clock,
  Layers,
  GraduationCap,
  Wrench,
  Tag,
  ArrowRight,
  Compass,
  ListChecks,
  FlaskConical,
} from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { getRecentSolvesAction, getSolveByIdAction } from "@/_actions_/solver.action";
import type { HistoricSession, SolveResponse, TopicColor } from "@/types/solver.types";

const TOPIC_COLORS = {
  sky: { bg: "bg-sky-light/60", text: "text-sky", border: "border-sky/30", solid: "bg-sky", glow: "shadow-sky/10" },
  violet: { bg: "bg-violet-light/60", text: "text-violet", border: "border-violet/30", solid: "bg-violet", glow: "shadow-violet/10" },
  success: { bg: "bg-success-light/60", text: "text-success", border: "border-success/30", solid: "bg-success", glow: "shadow-success/10" },
  secondary: { bg: "bg-secondary-light/60", text: "text-secondary-dark", border: "border-secondary/30", solid: "bg-secondary", glow: "shadow-secondary/10" },
  pink: { bg: "bg-pink-light/60", text: "text-pink", border: "border-pink/30", solid: "bg-pink", glow: "shadow-pink/10" },
  teal: { bg: "bg-teal-light/60", text: "text-teal", border: "border-teal/30", solid: "bg-teal", glow: "shadow-teal/10" },
  primary: { bg: "bg-primary-light/60", text: "text-primary", border: "border-primary/30", solid: "bg-primary", glow: "shadow-primary/10" },
} as const;

type ResultTab = "solution" | "answer" | "learning" | "practice" | "resources";

export default function SolveByIdPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [response, setResponse] = useState<SolveResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const [history, setHistory] = useState<HistoricSession[]>([]);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getRecentSolvesAction()
      .then((sessions) => {
        if (!cancelled) setHistory(sessions);
        console.log(sessions)
      })
      .catch((err) => {
        if (!cancelled) setHistoryError(err instanceof Error ? err.message : "Failed to load history.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    getSolveByIdAction(params.id)
      .then((data) => {
        if (!cancelled) setResponse(data.state);
        console.log(data)
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "Failed to load this solve.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const copyAnswer = async () => {
    if (!response?.final_answer?.plain_text) return;
    try {
      await navigator.clipboard.writeText(response.final_answer.plain_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const [resultTab, setResultTab] = useState<
    "solution" | "answer" | "learning" | "practice" | "resources"
  >("solution");

  const resultTabs = response
    ? [
        { id: "solution" as const, label: "Solution", icon: ListChecks, show: !!response.steps?.length },
        { id: "answer" as const, label: "Answer & Verify", icon: ShieldCheck, show: !!(response.final_answer || response.verification) },
        {
          id: "learning" as const,
          label: "Learning",
          icon: BookOpen,
          show: !!(
            response.related_concepts?.length ||
            response.key_formulae?.length ||
            response.alternative_methods?.length ||
            response.tips?.length ||
            response.common_mistakes?.length ||
            response.graph_data?.enabled
          ),
        },
        {
          id: "practice" as const,
          label: "Practice",
          icon: Target,
          show: !!(response.similar_questions?.length || response.practice_set?.length || response.next_topics?.length),
        },
        { id: "resources" as const, label: "Resources", icon: ExternalLink, show: !!response.resources?.length },
      ].filter((t) => t.show)
    : [];

  const activeResultTab = resultTabs.some((t) => t.id === resultTab) ? resultTab : resultTabs[0]?.id;

  return (
    <div className="flex min-h-screen bg-[#F9FAFC] text-ink antialiased">
      <main className="flex-1 md:pr-64">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8 space-y-6">

          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2.5 rounded-2xl border border-border bg-white py-14 text-sm text-ink-soft shadow-softer"
              >
                <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                Loading solve…
              </motion.div>
            )}

            {!isLoading && loadError && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2.5 rounded-2xl border border-pink/30 bg-pink-light/25 px-5 py-4 text-sm text-pink"
              >
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {loadError}
              </motion.div>
            )}

            {!isLoading && !loadError && response && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="grid grid-cols-1 gap-6"
              >
                <SectionCard>
                  <p className="text-xs font-mono uppercase tracking-wider text-muted mb-2">Problem</p>
                  <p className="text-lg font-semibold text-ink font-mono mb-4">{response.question}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {response.classification?.difficulty && (
                      <ChipAccent color="pink">{response.classification.difficulty}</ChipAccent>
                    )}
                    {response.classification?.subject && (
                      <ChipAccent color="violet">{response.classification.subject}</ChipAccent>
                    )}
                    {response.classification?.topic && (
                      <ChipAccent color="sky">{response.classification.topic}</ChipAccent>
                    )}
                    {response.verification?.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success-light/60 px-2.5 py-0.5 text-[11px] font-mono text-success">
                        <ShieldCheck className="h-3 w-3" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4 text-center">
                    <MiniStat icon={Clock} label="Est. Time" value={response.summary?.estimated_time ?? "—"} />
                    <MiniStat icon={Layers} label="Steps" value={String(response.summary?.steps_count ?? response.steps?.length ?? 0)} />
                    <MiniStat icon={Shapes} label="Concepts" value={String(response.summary?.concepts_used?.length ?? 0)} />
                  </div>
                </SectionCard>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-6">
                    {resultTabs.length > 0 && (
                      <div className="rounded-2xl border border-border bg-white shadow-softer overflow-hidden">
                        <div className="flex flex-wrap border-b border-border bg-subtle px-4 pt-2 gap-1">
                          {resultTabs.map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setResultTab(tab.id)}
                              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-medium tracking-wide transition-all ${
                                activeResultTab === tab.id
                                  ? "border-primary text-primary font-semibold"
                                  : "border-transparent text-ink-soft hover:text-ink"
                              }`}
                            >
                              <tab.icon className="h-3.5 w-3.5" /> {tab.label}
                            </button>
                          ))}
                        </div>

                        <div className="p-5 min-h-[260px]">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={activeResultTab}
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="space-y-6"
                            >
                              {activeResultTab === "solution" && !!response.steps?.length && (
                                <div className="space-y-1">
                                  {response.steps.map((step) => (
                                    <div
                                      key={step.step}
                                      className="group relative pl-8 pb-5 last:pb-0 border-l border-border last:border-transparent hover:bg-subtle/40 rounded-lg transition-colors -ml-1 pt-1"
                                    >
                                      <span className="absolute -left-[7px] top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white border-2 border-primary text-primary">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                      </span>
                                      <p className="text-xs font-mono text-muted mb-1">Step {step.step}</p>
                                      <p className="text-sm font-semibold text-ink mb-1">{step.title}</p>
                                      {step.explanation && (
                                        <TextWithInlineMath
                                          text={step.explanation}
                                          className="text-sm text-ink-soft leading-relaxed mb-2"
                                        />
                                      )}
                                      {step.latex && (
                                        <div className="rounded-lg bg-subtle p-3 border border-border/70 overflow-x-auto">
                                          <LatexBlock latex={step.latex} />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {activeResultTab === "answer" && (
                                <>
                                  {response.final_answer && (
                                    <div className="rounded-2xl border border-success/25 bg-success-light/30 p-5 space-y-3">
                                      <p className="text-xs font-mono uppercase tracking-wider text-success flex items-center gap-1.5">
                                        <ShieldCheck className="h-3.5 w-3.5" /> Final Answer
                                      </p>
                                      <div className="py-3 text-ink [&_.katex]:text-xl [&_.katex]:md:text-2xl [&_.katex-display]:my-0 flex justify-center overflow-x-auto">
                                        {response.final_answer.latex ? (
                                          <LatexBlock latex={response.final_answer.latex} />
                                        ) : (
                                          <p className="text-center font-mono text-xl md:text-2xl font-semibold text-ink">
                                            {response.final_answer.plain_text}
                                          </p>
                                        )}
                                      </div>
                                      <div className="flex items-center justify-center gap-2 pt-1">
                                        <button
                                          onClick={copyAnswer}
                                          className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-white px-3.5 py-1.5 text-xs font-medium text-success hover:bg-success-light/40 transition-colors"
                                        >
                                          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                          {copied ? "Copied" : "Copy"}
                                        </button>
                                        <button
                                          disabled
                                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-muted cursor-not-allowed"
                                          title="Coming soon"
                                        >
                                          <Download className="h-3.5 w-3.5" /> Download PDF
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {response.verification && (
                                    <div>
                                      <h4 className="text-xs font-mono uppercase tracking-wider text-muted mb-4 flex items-center gap-1.5">
                                        <ShieldCheck className="h-3.5 w-3.5" /> Verification
                                      </h4>
                                      <div className="flex items-center justify-between mb-3">
                                        <span
                                          className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                                            response.verification.verified ? "text-success" : "text-pink"
                                          }`}
                                        >
                                          <ShieldCheck className="h-4 w-4" />
                                          {response.verification.verified ? "Verified" : "Unverified"}
                                        </span>
                                        <span className="font-mono text-xs text-ink-soft">
                                          Confidence {Math.round((response.verification.confidence ?? 0) * 100)}%
                                        </span>
                                      </div>
                                      <div className="h-1.5 w-full rounded-full bg-subtle overflow-hidden mb-4">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${Math.round((response.verification.confidence ?? 0) * 100)}%` }}
                                          transition={{ duration: 0.6, ease: "easeOut" }}
                                          className="h-full rounded-full bg-success"
                                        />
                                      </div>
                                      {response.verification.method && (
                                        <p className="text-sm text-ink-soft leading-relaxed mb-2">
                                          <span className="font-medium text-ink">Method: </span>
                                          {response.verification.method}
                                        </p>
                                      )}
                                      {response.verification.reasoning && (
                                        <p className="text-sm text-ink-soft leading-relaxed">
                                          <span className="font-medium text-ink">Reasoning: </span>
                                          {response.verification.reasoning}
                                        </p>
                                      )}
                                      {!!response.verification.errors?.length && (
                                        <div className="mt-3 space-y-1">
                                          {response.verification.errors!.map((err, i) => (
                                            <p key={i} className="text-xs text-pink">• {err}</p>
                                          ))}
                                        </div>
                                      )}
                                      {!!response.verification.corrections?.length && (
                                        <div className="mt-2 space-y-1">
                                          {response.verification.corrections!.map((c, i) => (
                                            <p key={i} className="text-xs text-teal">• {c}</p>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </>
                              )}

                              {activeResultTab === "learning" && (
                                <>
                                  {(response.related_concepts?.length ||
                                    response.key_formulae?.length ||
                                    response.alternative_methods?.length ||
                                    response.tips?.length) && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      {!!response.related_concepts?.length && (
                                        <SectionCard title="Related Concepts" icon={Compass} compact>
                                          <ul className="space-y-1.5">
                                            {response.related_concepts.map((c, i) => (
                                              <li key={i} className="text-xs text-ink-soft flex gap-2">
                                                <span className="text-sky mt-0.5">•</span> {c}
                                              </li>
                                            ))}
                                          </ul>
                                        </SectionCard>
                                      )}

                                      {!!response.key_formulae?.length && (
                                        <SectionCard title="Formulae Used" icon={Sigma} compact>
                                          <div className="space-y-2">
                                            {response.key_formulae.map((f, i) => (
                                              <div key={i} className="rounded-lg border border-violet/20 bg-violet-light/25 px-3 py-2">
                                                <p className="text-[10px] text-ink-soft mb-1">{f.name}</p>
                                                <div className="[&_.katex]:text-xs [&_.katex-display]:my-0 overflow-x-auto">
                                                  <LatexBlock latex={f.latex} />
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </SectionCard>
                                      )}

                                      {!!response.alternative_methods?.length && (
                                        <SectionCard title="Alternative Methods" icon={FlaskConical} compact>
                                          <div className="space-y-3">
                                            {response.alternative_methods.map((m, i) => (
                                              <div key={i}>
                                                <p className="text-xs font-semibold text-ink mb-1">{m.name}</p>
                                                <p className="text-xs text-ink-soft leading-relaxed">{m.description}</p>
                                              </div>
                                            ))}
                                          </div>
                                        </SectionCard>
                                      )}

                                      {!!response.tips?.length && (
                                        <SectionCard title="Tips" icon={Lightbulb} compact>
                                          <ul className="space-y-1.5">
                                            {response.tips.map((t, i) => (
                                              <li key={i} className="text-xs text-ink-soft flex gap-2">
                                                <Sparkles className="h-3 w-3 text-primary shrink-0 mt-0.5" /> {t}
                                              </li>
                                            ))}
                                          </ul>
                                        </SectionCard>
                                      )}
                                    </div>
                                  )}

                                  {response.graph_data?.enabled && (
                                    <SectionCard title="Graph" icon={Target}>
                                      <div className="flex items-center justify-center p-4">
                                        <p className="text-xs text-ink-soft">Graph data available — render with your charting library.</p>
                                      </div>
                                    </SectionCard>
                                  )}

                                  {!!response.common_mistakes?.length && (
                                    <SectionCard title="Common Mistakes" icon={AlertTriangle}>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {response.common_mistakes.map((m, i) => (
                                          <div
                                            key={i}
                                            className="flex items-start gap-2 rounded-xl border border-pink/25 bg-pink-light/25 px-3 py-2.5"
                                          >
                                            <AlertTriangle className="h-3.5 w-3.5 text-pink shrink-0 mt-0.5" />
                                            <p className="text-xs text-ink-soft leading-relaxed">{m}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </SectionCard>
                                  )}
                                </>
                              )}

                              {activeResultTab === "practice" && (
                                <>
                                  {(response.similar_questions?.length || response.practice_set?.length) && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      {!!response.similar_questions?.length && (
                                        <SectionCard title="Similar Questions" icon={Target} compact>
                                          <div className="space-y-2">
                                            {response.similar_questions.map((q, i) => (
                                              <PracticeRow key={i} label={q.difficulty} text={q.question} />
                                            ))}
                                          </div>
                                        </SectionCard>
                                      )}
                                      {!!response.practice_set?.length && (
                                        <SectionCard title="Practice Set" icon={ListChecks} compact>
                                          <div className="space-y-2">
                                            {response.practice_set.map((q) => (
                                              <PracticeRow key={q.id} label={`#${q.id}`} text={q.question} />
                                            ))}
                                          </div>
                                        </SectionCard>
                                      )}
                                    </div>
                                  )}

                                  {!!response.next_topics?.length && (
                                    <SectionCard title="Next Topics" icon={ArrowRight}>
                                      <div className="flex flex-wrap gap-2">
                                        {response.next_topics.map((t, i) => (
                                          <button
                                            key={i}
                                            className="inline-flex items-center gap-1 rounded-full border border-border bg-subtle px-3 py-1.5 text-xs text-ink-soft hover:border-primary/30 hover:text-primary hover:bg-primary-light/30 transition-colors"
                                          >
                                            {t}
                                          </button>
                                        ))}
                                      </div>
                                    </SectionCard>
                                  )}
                                </>
                              )}

                              {activeResultTab === "resources" && !!response.resources?.length && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  {response.resources.map((r, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center justify-between gap-2 rounded-xl border border-border p-3 hover:border-primary/20 hover:bg-subtle/50 transition-all"
                                    >
                                      <div>
                                        <p className="text-xs font-medium text-ink">{r.title}</p>
                                        <p className="text-[10px] text-muted mt-0.5">{r.type}</p>
                                      </div>
                                      <ExternalLink className="h-3.5 w-3.5 text-muted shrink-0" />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6 lg:sticky lg:top-6 self-start">
                    {response.classification && (
                      <div className="rounded-2xl border border-border bg-white p-5 shadow-softer space-y-4">
                        <h3 className="text-xs font-mono uppercase tracking-wider text-muted flex items-center gap-1.5">
                          <Shapes className="h-3.5 w-3.5" /> Classification
                        </h3>
                        <div className="space-y-3 text-xs">
                          <ClassificationRow icon={Tag} label="Subject" value={response.classification.subject} />
                          <ClassificationRow icon={BookOpen} label="Chapter" value={response.classification.chapter} />
                          <ClassificationRow icon={Compass} label="Topic" value={response.classification.topic} />
                          <ClassificationRow icon={Layers} label="Subtopic" value={response.classification.subtopic} />
                          <ClassificationRow icon={Target} label="Difficulty" value={response.classification.difficulty} />
                          <ClassificationRow icon={ListChecks} label="Problem Type" value={response.classification.problem_type} />
                          <ClassificationRow icon={GraduationCap} label="Grade Level" value={response.classification.grade_level} />
                        </div>

                        {!!response.classification.required_concepts?.length && (
                          <div className="pt-3 border-t border-border">
                            <p className="text-[11px] text-ink-soft mb-1.5 flex items-center gap-1.5">
                              <Wrench className="h-3 w-3" /> Concepts Used
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {response.classification.required_concepts.map((c, i) => (
                                <span
                                  key={i}
                                  className="rounded-full border border-violet/25 bg-violet-light/40 px-2 py-0.5 text-[10px] font-mono text-violet"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
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
                    className={`${session.id === params.id? "bg-subtle font-bold border-sky-200":""} flex w-full flex-row-reverse gap-2 items-center justify-end rounded-xl border-2 border-sky-50 px-3 py-2.5 text-left text-xs transition-colors hover:bg-subtle`}
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

function SectionCard({
  title,
  icon: Icon,
  children,
  compact,
}: {
  title?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl border border-border bg-white shadow-softer ${compact ? "p-4" : "p-5"}`}
    >
      {title && (
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted mb-4 flex items-center gap-1.5">
          {Icon && <Icon className="h-3.5 w-3.5" />} {title}
        </h3>
      )}
      {children}
    </motion.div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <span className="text-sm font-semibold text-ink">{value}</span>
      <span className="text-[10px] text-muted uppercase tracking-wide">{label}</span>
    </div>
  );
}

function ClassificationRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-ink-soft flex items-center gap-1.5">
        <Icon className="h-3 w-3" /> {label}
      </span>
      <span className="font-medium text-ink text-right">{value}</span>
    </div>
  );
}

function PracticeRow({ label, text }: { label: string; text: string }) {
  return (
    <button className="group flex w-full items-center justify-between gap-2 rounded-xl border border-border px-3 py-2.5 text-left hover:border-primary/20 hover:bg-subtle/50 transition-all">
      <div>
        <span className="block text-[10px] font-mono text-muted mb-0.5">{label}</span>
        <span className="text-xs text-ink-soft group-hover:text-ink">{text}</span>
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-muted group-hover:text-primary transition-transform group-hover:translate-x-0.5 shrink-0" />
    </button>
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

function LatexBlock({ latex, className = "" }: { latex: string; className?: string }) {
  const lines = latex
    .split("\\\\")
    .map((l) => l.trim())
    .filter(Boolean);

  if (!lines.length) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {lines.map((line, i) => (
        <BlockMath
          key={i}
          math={line}
          errorColor="#dc2626"
          renderError={() => (
            <pre className="whitespace-pre-wrap rounded-lg bg-subtle px-2 py-1 font-mono text-[11px] text-ink-soft">
              {line}
            </pre>
          )}
        />
      ))}
    </div>
  );
}

function TextWithInlineMath({ text, className = "" }: { text: string; className?: string }) {
  const parts = text.split(/(\$[^$]+\$)/g).filter((p) => p !== "");

  return (
    <p className={className}>
      {parts.map((part, i) => {
        const isMath = part.startsWith("$") && part.endsWith("$") && part.length > 1;
        if (!isMath) return <span key={i}>{part}</span>;

        const math = part.slice(1, -1).trim();
        return (
          <InlineMath
            key={i}
            math={math}
            errorColor="#dc2626"
            renderError={() => <span className="font-mono text-xs">{math}</span>}
          />
        );
      })}
    </p>
  );
}