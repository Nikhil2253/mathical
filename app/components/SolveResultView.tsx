"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Shapes,
  ShieldCheck,
  Target,
  ChevronRight,
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
  Sparkle,
} from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import type { SolveResponse, TopicColor } from "@/types/solver.types";

type ResultTab = "solution" | "answer" | "learning" | "practice" | "resources";

const TOPIC_COLORS = {
  sky: { bg: "bg-sky-light/60", text: "text-sky", border: "border-sky/30", solid: "bg-sky", glow: "shadow-sky/10" },
  violet: { bg: "bg-violet-light/60", text: "text-violet", border: "border-violet/30", solid: "bg-violet", glow: "shadow-violet/10" },
  success: { bg: "bg-success-light/60", text: "text-success", border: "border-success/30", solid: "bg-success", glow: "shadow-success/10" },
  secondary: { bg: "bg-secondary-light/60", text: "text-secondary-dark", border: "border-secondary/30", solid: "bg-secondary", glow: "shadow-secondary/10" },
  pink: { bg: "bg-pink-light/60", text: "text-pink", border: "border-pink/30", solid: "bg-pink", glow: "shadow-pink/10" },
  teal: { bg: "bg-teal-light/60", text: "text-teal", border: "border-teal/30", solid: "bg-teal", glow: "shadow-teal/10" },
  primary: { bg: "bg-primary-light/60", text: "text-primary", border: "border-primary/30", solid: "bg-primary", glow: "shadow-primary/10" },
} as const;

const DIFFICULTY_ACCENT: Record<string, TopicColor> = {
  Easy: "success",
  Medium: "secondary",
  Hard: "pink",
};

export default function SolveResultView({ response }: { response: SolveResponse }) {
  const [copied, setCopied] = useState(false);
  const [resultTab, setResultTab] = useState<ResultTab>("solution");

  const copyAnswer = async () => {
    if (!response?.final_answer?.plain_text) return;
    try {
      await navigator.clipboard.writeText(response.final_answer.plain_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const resultTabs = [
    { id: "solution" as const, label: "Solution", icon: ListChecks, show: !!response?.steps?.length },
    { id: "answer" as const, label: "Answer & Verify", icon: ShieldCheck, show: !!(response?.final_answer || response?.verification) },
    {
      id: "learning" as const,
      label: "Learning",
      icon: BookOpen,
      show: !!(
        response?.related_concepts?.length ||
        response?.key_formulae?.length ||
        response?.alternative_methods?.length ||
        response?.tips?.length ||
        response?.common_mistakes?.length ||
        response?.graph_data?.enabled
      ),
    },
    {
      id: "practice" as const,
      label: "Practice",
      icon: Target,
      show: !!(response?.similar_questions?.length || response?.practice_set?.length || response?.next_topics?.length),
    },
    { id: "resources" as const, label: "Resources", icon: ExternalLink, show: !!response?.resources?.length },
  ].filter((t) => t.show);

  const activeResultTab = resultTabs.some((t) => t.id === resultTab) ? resultTab : resultTabs[0]?.id;
  const difficultyColor = response.classification?.difficulty
    ? DIFFICULTY_ACCENT[response.classification.difficulty] ?? "primary"
    : "primary";

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="grid grid-cols-1 gap-6 lg:grid-cols-3"
    >
      <div className="lg:col-span-2 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-softer"
        >
          <div className={`absolute inset-x-0 top-0 h-1 ${TOPIC_COLORS[difficultyColor].solid}`} />
          <div className="p-5 md:p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5">
                  <Sparkle className="h-3 w-3 text-primary" /> Problem
                </p>
                <p className="text-xl font-semibold text-ink font-mono leading-snug">{response.question}</p>
              </div>
              {response.verification?.verified && (
                <span className="hidden sm:inline-flex shrink-0 items-center gap-1 rounded-full border border-success/30 bg-success-light/60 px-3 py-1 text-[11px] font-mono font-medium text-success">
                  <ShieldCheck className="h-3 w-3" /> Verified
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-5">
              {response.classification?.difficulty && (
                <ChipAccent color={difficultyColor}>{response.classification.difficulty}</ChipAccent>
              )}
              {response.classification?.subject && (
                <ChipAccent color="violet">{response.classification.subject}</ChipAccent>
              )}
              {response.classification?.topic && (
                <ChipAccent color="sky">{response.classification.topic}</ChipAccent>
              )}
              {response.verification?.verified && (
                <span className="sm:hidden inline-flex items-center gap-1 rounded-full border border-success/30 bg-success-light/60 px-2.5 py-0.5 text-[11px] font-mono text-success">
                  <ShieldCheck className="h-3 w-3" /> Verified
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-xl bg-subtle/60 p-3 border border-border/60">
              <MiniStat icon={Clock} label="Est. Time" value={response.summary?.estimated_time ?? "—"} />
              <MiniStat icon={Layers} label="Steps" value={String(response.summary?.steps_count ?? response.steps?.length ?? 0)} />
              <MiniStat icon={Shapes} label="Concepts" value={String(response.summary?.concepts_used?.length ?? 0)} />
            </div>
          </div>
        </motion.div>

        {resultTabs.length > 0 && (
          <div className="rounded-2xl border border-border bg-white shadow-softer overflow-hidden">
            <div className="flex flex-wrap gap-1 border-b border-border bg-subtle/70 px-3 py-2">
              {resultTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setResultTab(tab.id)}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium tracking-wide transition-all ${
                    activeResultTab === tab.id
                      ? "bg-white text-primary shadow-sm border border-border"
                      : "text-ink-soft hover:text-ink hover:bg-white/60 border border-transparent"
                  }`}
                >
                  <tab.icon className="h-3.5 w-3.5" /> {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5 md:p-6 min-h-[260px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeResultTab}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="space-y-6"
                >
                  {activeResultTab === "solution" && !!response.steps?.length && (
                    <div className="space-y-0.5">
                      {response.steps.map((step, idx) => (
                        <div
                          key={step.step}
                          className="group relative pl-9 pb-6 last:pb-0 border-l-2 border-border last:border-transparent hover:bg-subtle/40 rounded-lg transition-colors -ml-1 pt-1"
                        >
                          <span className="absolute -left-[11px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-mono font-semibold text-white shadow-sm">
                            {idx + 1}
                          </span>
                          <p className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1">Step {step.step}</p>
                          <p className="text-sm font-semibold text-ink mb-1.5">{step.title}</p>
                          {step.explanation && (
                            <TextWithInlineMath
                              text={step.explanation}
                              className="text-sm text-ink-soft leading-relaxed mb-2.5"
                            />
                          )}
                          {step.latex && (
                            <div className="rounded-xl bg-subtle p-3.5 border border-border/70 overflow-x-auto">
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
                        <div className="relative overflow-hidden rounded-2xl border border-success/25 bg-gradient-to-br from-success-light/40 via-success-light/20 to-transparent p-6 space-y-4">
                          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-success/10 blur-2xl" />
                          <p className="relative text-[11px] font-mono uppercase tracking-wider text-success flex items-center gap-1.5 font-semibold">
                            <ShieldCheck className="h-3.5 w-3.5" /> Final Answer
                          </p>
                          <div className="relative py-4 text-ink [&_.katex]:text-xl [&_.katex]:md:text-2xl [&_.katex-display]:my-0 flex justify-center overflow-x-auto">
                            {response.final_answer.latex ? (
                              <LatexBlock latex={response.final_answer.latex} />
                            ) : (
                              <p className="text-center font-mono text-xl md:text-2xl font-semibold text-ink">
                                {response.final_answer.plain_text}
                              </p>
                            )}
                          </div>
                          <div className="relative flex items-center justify-center gap-2 pt-1">
                            <button
                              onClick={copyAnswer}
                              className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-white px-4 py-1.5 text-xs font-medium text-success hover:bg-success-light/50 hover:shadow-sm transition-all"
                            >
                              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                              {copied ? "Copied" : "Copy Answer"}
                            </button>
                            <button
                              disabled
                              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-medium text-muted cursor-not-allowed"
                              title="Coming soon"
                            >
                              <Download className="h-3.5 w-3.5" /> Download PDF
                            </button>
                          </div>
                        </div>
                      )}

                      {response.verification && (
                        <div className="rounded-2xl border border-border bg-subtle/40 p-5">
                          <h4 className="text-[11px] font-mono uppercase tracking-wider text-muted mb-4 flex items-center gap-1.5 font-semibold">
                            <ShieldCheck className="h-3.5 w-3.5" /> Verification
                          </h4>
                          <div className="flex items-center justify-between mb-3">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                                response.verification.verified
                                  ? "bg-success-light/60 text-success"
                                  : "bg-pink-light/60 text-pink"
                              }`}
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                              {response.verification.verified ? "Verified" : "Unverified"}
                            </span>
                            <span className="font-mono text-xs text-ink-soft">
                              Confidence {Math.round((response.verification.confidence ?? 0) * 100)}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-white overflow-hidden mb-4 border border-border/60">
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
                          className="flex items-center justify-between gap-2 rounded-xl border border-border p-3.5 hover:border-primary/30 hover:bg-subtle/60 hover:shadow-sm transition-all cursor-pointer"
                        >
                          <div>
                            <p className="text-xs font-medium text-ink">{r.title}</p>
                            <span className="inline-block mt-1 rounded-full bg-subtle px-2 py-0.5 text-[10px] text-ink-soft">
                              {r.type}
                            </span>
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
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-muted flex items-center gap-1.5 font-semibold">
              <Shapes className="h-3.5 w-3.5" /> Classification
            </h3>
            <div className="space-y-0.5 text-xs divide-y divide-border/60">
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
                <p className="text-[11px] text-ink-soft mb-2 flex items-center gap-1.5">
                  <Wrench className="h-3 w-3" /> Concepts Used
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {response.classification.required_concepts.map((c, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-violet/25 bg-violet-light/40 px-2.5 py-0.5 text-[10px] font-mono text-violet"
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
    </motion.div>
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
      className={`rounded-2xl border border-border bg-white shadow-softer hover:shadow-md transition-shadow ${compact ? "p-4" : "p-5"}`}
    >
      {title && (
        <h3 className="text-[11px] font-mono uppercase tracking-wider text-muted mb-4 flex items-center gap-1.5 font-semibold">
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
    <div className="flex flex-col items-center gap-1 py-1">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-light/50">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </span>
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
    <div className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
      <span className="text-ink-soft flex items-center gap-1.5">
        <Icon className="h-3 w-3" /> {label}
      </span>
      <span className="font-medium text-ink text-right">{value}</span>
    </div>
  );
}

function PracticeRow({ label, text }: { label: string; text: string }) {
  return (
    <button className="group flex w-full items-center justify-between gap-2 rounded-xl border border-border px-3 py-2.5 text-left hover:border-primary/30 hover:bg-subtle/50 hover:shadow-sm transition-all">
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
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-mono font-medium ${c.border} ${c.bg} ${c.text}`}>
      {children}
    </span>
  );
}

function normalizeLatex(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" \\\\ ")
    .replace(/(\\\\\s*){2,}/g, " \\\\ ");
}

function LatexBlock({ latex, className = "" }: { latex: string; className?: string }) {
  const hasEnvironment = /\\begin\{[a-zA-Z*]+\}/.test(latex);

  if (hasEnvironment) {
    const normalized = normalizeLatex(latex);
    return (
      <div className={className}>
        <BlockMath
          math={normalized}
          errorColor="#dc2626"
          renderError={() => (
            <pre className="whitespace-pre-wrap rounded-lg bg-subtle px-2 py-1 font-mono text-[11px] text-ink-soft">
              {latex}
            </pre>
          )}
        />
      </div>
    );
  }

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