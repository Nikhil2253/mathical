"use client";

import { useEffect, useState } from "react";
import { motion, useInView, AnimatePresence, animate } from "framer-motion";
import { useRef } from "react";
import {
  Search,
  BookOpen,
  GraduationCap,
  Trophy,
  Bookmark,
  BookmarkCheck,
  Clock,
  Flame,
  TrendingUp,
  PlayCircle,
  FunctionSquare,
  BarChart3,
  Shapes,
  Grid3x3,
  Waves,
  Star,
  ChevronRight,
  History,
  CheckCircle2,
  Lock,
  Eye,
  Layers,
  Sparkles,
  ArrowRight,
  Sigma,
  Video,
  Menu,
  X as CloseIcon,
  GitBranch,
  Link as LinkIcon,
  X as XIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design system — inherited 1:1 from the marketing page              */
/* ------------------------------------------------------------------ */

const TOPIC_COLORS = {
  sky: { bg: "bg-sky-light", text: "text-sky", border: "border-sky/30", solid: "bg-sky" },
  violet: { bg: "bg-violet-light", text: "text-violet", border: "border-violet/30", solid: "bg-violet" },
  success: { bg: "bg-success-light", text: "text-success", border: "border-success/30", solid: "bg-success" },
  secondary: { bg: "bg-secondary-light", text: "text-secondary-dark", border: "border-secondary/30", solid: "bg-secondary" },
  pink: { bg: "bg-pink-light", text: "text-pink", border: "border-pink/30", solid: "bg-pink" },
  teal: { bg: "bg-teal-light", text: "text-teal", border: "border-teal/30", solid: "bg-teal" },
  primary: { bg: "bg-primary-light", text: "text-primary", border: "border-primary/30", solid: "bg-primary" },
} as const;

type TopicColor = keyof typeof TOPIC_COLORS;

const NAV_LINKS = [
  { label: "Subjects", href: "#subjects" },
  { label: "Learning Paths", href: "#paths" },
  { label: "Formulas", href: "#formulas" },
  { label: "Practice", href: "#practice" },
];

const JUMP_LINKS: { label: string; href: string; color: TopicColor }[] = [
  { label: "Continue Learning", href: "#continue", color: "primary" },
  { label: "Learning Paths", href: "#paths", color: "sky" },
  { label: "Subjects", href: "#subjects", color: "violet" },
  { label: "Popular Chapters", href: "#chapters", color: "success" },
  { label: "Formula Library", href: "#formulas", color: "secondary" },
  { label: "Visual Learning", href: "#visual", color: "pink" },
  { label: "Interactive Topics", href: "#interactive", color: "teal" },
  { label: "Daily Practice", href: "#practice", color: "primary" },
];

/* ------------------------------------------------------------------ */
/*  Data — realistic dummy content                                     */
/* ------------------------------------------------------------------ */

const SUBJECTS: { title: string; icon: any; color: TopicColor; chapters: number; mastery: number }[] = [
  { title: "Algebra", icon: FunctionSquare, color: "sky", chapters: 32, mastery: 74 },
  { title: "Calculus", icon: TrendingUp, color: "violet", chapters: 28, mastery: 51 },
  { title: "Statistics", icon: BarChart3, color: "success", chapters: 24, mastery: 88 },
  { title: "Geometry", icon: Shapes, color: "secondary", chapters: 20, mastery: 63 },
  { title: "Linear Algebra", icon: Grid3x3, color: "pink", chapters: 16, mastery: 39 },
  { title: "Differential Equations", icon: Waves, color: "teal", chapters: 14, mastery: 22 },
];

const CONTINUE_LEARNING: { title: string; subject: string; color: TopicColor; progress: number; next: string }[] = [
  { title: "Derivatives & Rates of Change", subject: "Calculus", color: "violet", progress: 68, next: "Continue: The Chain Rule" },
  { title: "Systems of Linear Equations", subject: "Algebra", color: "sky", progress: 42, next: "Continue: Elimination Method" },
  { title: "Probability Distributions", subject: "Statistics", color: "success", progress: 85, next: "Continue: Normal Distribution" },
];

const LEARNING_PATHS: { title: string; desc: string; chapters: number; level: string; color: TopicColor }[] = [
  { title: "Foundations of Algebra", desc: "From variables to quadratic equations, built step by step.", chapters: 12, level: "Beginner", color: "sky" },
  { title: "Calculus I: Limits to Integrals", desc: "A complete first course in differential and integral calculus.", chapters: 18, level: "Intermediate", color: "violet" },
  { title: "Statistics & Probability", desc: "Distributions, inference, and reasoning under uncertainty.", chapters: 14, level: "Beginner", color: "success" },
  { title: "Linear Algebra Essentials", desc: "Vectors, matrices, and transformations for real applications.", chapters: 10, level: "Advanced", color: "pink" },
];

const POPULAR_CHAPTERS: { title: string; subject: string; color: TopicColor; learners: string }[] = [
  { title: "Quadratic Equations", subject: "Algebra", color: "sky", learners: "12.4k" },
  { title: "Integration by Parts", subject: "Calculus", color: "violet", learners: "9.8k" },
  { title: "Bayes' Theorem", subject: "Statistics", color: "success", learners: "8.2k" },
  { title: "Eigenvalues & Eigenvectors", subject: "Linear Algebra", color: "pink", learners: "6.1k" },
  { title: "The Unit Circle", subject: "Geometry", color: "secondary", learners: "5.7k" },
  { title: "First-Order ODEs", subject: "Differential Equations", color: "teal", learners: "3.9k" },
];

const FORMULA_LIBRARY: { title: string; count: number; color: TopicColor }[] = [
  { title: "Algebra Formulas", count: 84, color: "sky" },
  { title: "Calculus Formulas", count: 96, color: "violet" },
  { title: "Statistics Formulas", count: 47, color: "success" },
  { title: "Geometry Formulas", count: 58, color: "secondary" },
  { title: "Linear Algebra Formulas", count: 41, color: "pink" },
  { title: "Diff. Equations Formulas", count: 29, color: "teal" },
];

const VISUAL_LEARNING: { title: string; desc: string; color: TopicColor }[] = [
  { title: "Function Grapher", desc: "Plot any function and watch it move as you edit it.", color: "sky" },
  { title: "Vector Field Explorer", desc: "See gradients and flows come alive in 2D and 3D.", color: "pink" },
  { title: "Distribution Viewer", desc: "Shape probability distributions and watch curves shift.", color: "success" },
  { title: "3D Surface Plotter", desc: "Rotate and slice multivariable functions in real time.", color: "violet" },
];

const INTERACTIVE_TOPICS: { title: string; subject: string; color: TopicColor }[] = [
  { title: "Unit Circle Explorer", subject: "Geometry", color: "secondary" },
  { title: "Matrix Transformation Sandbox", subject: "Linear Algebra", color: "pink" },
  { title: "Derivative Slope Visualizer", subject: "Calculus", color: "violet" },
  { title: "Distribution Simulator", subject: "Statistics", color: "success" },
];

const RECOMMENDED_COURSES: { title: string; duration: string; rating: number; level: string; color: TopicColor }[] = [
  { title: "Calculus Bootcamp", duration: "6h 40m", rating: 4.9, level: "Intermediate", color: "violet" },
  { title: "Statistics for Beginners", duration: "5h 10m", rating: 4.8, level: "Beginner", color: "success" },
  { title: "Mastering Linear Algebra", duration: "7h 20m", rating: 4.7, level: "Advanced", color: "pink" },
  { title: "Geometry Fundamentals", duration: "4h 50m", rating: 4.9, level: "Beginner", color: "secondary" },
];

const RECENT_TUTORIALS: { title: string; duration: string; subject: string; color: TopicColor }[] = [
  { title: "Solving Systems by Substitution", duration: "8 min", subject: "Algebra", color: "sky" },
  { title: "Understanding the Chain Rule", duration: "11 min", subject: "Calculus", color: "violet" },
  { title: "Intro to Standard Deviation", duration: "7 min", subject: "Statistics", color: "success" },
  { title: "Proving Triangle Similarity", duration: "9 min", subject: "Geometry", color: "secondary" },
];

const LEARNING_STATS: { value: number; suffix: string; label: string; color: TopicColor }[] = [
  { value: 142, suffix: "h", label: "Hours Studied", color: "primary" },
  { value: 216, suffix: "", label: "Concepts Mastered", color: "violet" },
  { value: 12, suffix: "d", label: "Current Streak", color: "secondary" },
  { value: 91, suffix: "%", label: "Practice Accuracy", color: "success" },
];

const ACHIEVEMENTS: { title: string; desc: string; unlocked: boolean; color: TopicColor }[] = [
  { title: "7-Day Streak", desc: "Studied 7 days in a row", unlocked: true, color: "primary" },
  { title: "Calculus Novice", desc: "Completed 10 calculus chapters", unlocked: true, color: "violet" },
  { title: "100 Problems Solved", desc: "Solved 100 practice problems", unlocked: true, color: "success" },
  { title: "Algebra Master", desc: "Reached 90% mastery in Algebra", unlocked: false, color: "sky" },
  { title: "Perfect Week", desc: "100% practice accuracy for 7 days", unlocked: false, color: "secondary" },
  { title: "Linear Explorer", desc: "Completed Linear Algebra path", unlocked: false, color: "pink" },
];

const RECENTLY_VIEWED: { title: string; subject: string; time: string; color: TopicColor }[] = [
  { title: "The Chain Rule", subject: "Calculus", time: "2h ago", color: "violet" },
  { title: "Matrix Inverses", subject: "Linear Algebra", time: "Yesterday", color: "pink" },
  { title: "Standard Deviation", subject: "Statistics", time: "2 days ago", color: "success" },
  { title: "Law of Cosines", subject: "Geometry", time: "3 days ago", color: "secondary" },
];

const BOOKMARKED_LESSONS: { title: string; subject: string; color: TopicColor }[] = [
  { title: "Integration by Parts", subject: "Calculus", color: "violet" },
  { title: "Bayes' Theorem", subject: "Statistics", color: "success" },
  { title: "The Quadratic Formula", subject: "Algebra", color: "sky" },
  { title: "Eigenvectors", subject: "Linear Algebra", color: "pink" },
];

const DAILY_PRACTICE_SET = [
  { label: "Factoring Trinomials", color: "sky" as TopicColor },
  { label: "Related Rates", color: "violet" as TopicColor },
  { label: "Confidence Intervals", color: "success" as TopicColor },
];

/* ------------------------------------------------------------------ */
/*  Shared UI pieces                                                    */
/* ------------------------------------------------------------------ */

function Chip({
  children,
  active = false,
  color = "primary",
}: {
  children: React.ReactNode;
  active?: boolean;
  color?: TopicColor;
}) {
  const c = TOPIC_COLORS[color];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-mono ${
        active ? `${c.border} ${c.bg} ${c.text}` : "border-border bg-white text-ink-soft"
      }`}
    >
      {children}
    </span>
  );
}

function SectionEyebrow({ children, color = "primary" }: { children: React.ReactNode; color?: TopicColor }) {
  const c = TOPIC_COLORS[color];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border ${c.border} bg-white px-3 py-1 font-mono text-xs uppercase tracking-widest ${c.text}`}>
      <Sigma className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ProgressBar({ value, color = "primary" }: { value: number; color?: TopicColor }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const c = TOPIC_COLORS[color];
  return (
    <div ref={ref} className="h-2 w-full overflow-hidden rounded-full bg-subtle">
      <motion.div
        className={`h-full rounded-full ${c.solid}`}
        initial={{ width: 0 }}
        animate={{ width: inView ? `${value}%` : 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

function Counter({ value, suffix, color = "primary" }: { value: number; suffix: string; color?: TopicColor }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);
  const c = TOPIC_COLORS[color];

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) {
        setDisplay(Math.floor(v));
      },
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className={`font-mono text-4xl md:text-5xl font-semibold ${c.text}`}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Navbar / Footer — same shell as the marketing page                 */
/* ------------------------------------------------------------------ */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md border-b border-border shadow-softer" : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="/" className="flex items-center gap-2">
          <img src="/mathical-logo.png" alt="" className="w-[200px] h-[60px]" />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-sm text-[#1A237E] transition-colors duration-300 hover:text-ink after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#1A237E] after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a href="/login" className="text-sm text-white transition-colors px-4 py-2 rounded-full bg-gradient-to-r from-primary to-sky hover:opacity-50 transition-transform hover:-translate-y-0.5">
            Log in
          </a>
          <a href="/solve" className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-primary-dark">
            Start Solving Free
          </a>
        </div>

        <button className="md:hidden text-ink" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <CloseIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-white md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm text-ink-soft">
                  {l.label}
                </a>
              ))}
              <a href="/solve" className="rounded-full bg-primary px-4 py-2.5 text-center text-sm font-medium text-white">
                Start Solving Free
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <img src="/mathical-logo.png" alt="" className="w-[200px] h-15" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              An AI mathematics tutor that explains every step, verifies every answer.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted">Learn</p>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                <li><a href="#subjects" className="hover:text-ink">Subjects</a></li>
                <li><a href="#formulas" className="hover:text-ink">Formula Library</a></li>
                <li><a href="#paths" className="hover:text-ink">Learning Paths</a></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted">Legal</p>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                <li><a href="#" className="hover:text-ink">Privacy</a></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted">Social</p>
              <div className="mt-4 flex gap-3">
                <a href="#" aria-label="GitBranch" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-soft hover:text-sky hover:border-sky/30">
                  <GitBranch className="h-4 w-4" />
                </a>
                <a href="#" aria-label="Link" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-soft hover:text-violet hover:border-violet/30">
                  <LinkIcon className="h-4 w-4" />
                </a>
                <a href="#" aria-label="XIcon" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-soft hover:text-pink hover:border-pink/30">
                  <XIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} Mathical. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero with search                                                    */
/* ------------------------------------------------------------------ */

function LearnHero() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Algebra", "Calculus", "Statistics", "Geometry", "Linear Algebra"];

  return (
    <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full bg-primary/20 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute top-40 left-[-10%] h-[380px] w-[380px] rounded-full bg-pink/15 blur-3xl animate-blob [animation-delay:3s]" />

      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <SectionEyebrow>Your Learning Home</SectionEyebrow>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl"
        >
          Study Mathematics{" "}
          <span className="bg-gradient-to-r from-primary via-primary to-sky bg-clip-text text-transparent">
            Concept by Concept
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft"
        >
          Browse subjects, follow guided paths, and build real understanding — at your own pace.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-9 max-w-2xl"
        >
          <div className="flex items-center gap-3 rounded-full border border-border bg-white px-5 py-3.5 shadow-soft transition-all focus-within:border-primary/40 focus-within:shadow-glow">
            <Search className="h-4.5 w-4.5 shrink-0 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics, chapters, or formulas — e.g. “chain rule”"
              className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
            />
            <button className="hidden shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-white transition-transform hover:-translate-y-0.5 hover:bg-primary-dark sm:inline-flex">
              Search
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {filters.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)}>
                <Chip active={activeFilter === f} color={activeFilter === f ? "primary" : "primary"}>
                  {f}
                </Chip>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Continue Learning                                                   */
/* ------------------------------------------------------------------ */

function ContinueLearning() {
  return (
    <section id="continue" className="relative py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="flex items-end justify-between">
          <div>
            <SectionEyebrow color="primary">Pick Up Where You Left Off</SectionEyebrow>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Continue Learning</h2>
          </div>
          <a href="#" className="hidden items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark sm:flex">
            View all <ChevronRight className="h-4 w-4" />
          </a>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CONTINUE_LEARNING.map((item, i) => {
            const c = TOPIC_COLORS[item.color];
            return (
              <Reveal key={item.title} delay={i * 0.06}>
                <div className="group h-full rounded-xl2 border border-border bg-white p-6 shadow-softer transition-all hover:-translate-y-1 hover:shadow-soft">
                  <div className="flex items-center justify-between">
                    <Chip color={item.color} active>{item.subject}</Chip>
                    <span className="font-mono text-xs text-muted">{item.progress}%</span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-ink">{item.title}</h3>
                  <div className="mt-5">
                    <ProgressBar value={item.progress} color={item.color} />
                  </div>
                  <button className={`mt-5 inline-flex items-center gap-1.5 text-sm font-medium ${c.text} transition-colors`}>
                    <PlayCircle className="h-4 w-4" />
                    {item.next}
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Learning Paths                                                      */
/* ------------------------------------------------------------------ */

function LearningPaths() {
  return (
    <section id="paths" className="relative bg-subtle py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow color="sky">Guided Tracks</SectionEyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Learning paths</h2>
          <p className="mt-4 text-ink-soft">Structured, chapter-by-chapter routes through each subject.</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {LEARNING_PATHS.map((p, i) => {
            const c = TOPIC_COLORS[p.color];
            return (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="group flex h-full flex-col rounded-xl2 border border-border bg-white p-7 shadow-softer transition-all hover:-translate-y-1 hover:shadow-soft">
                  <div className="flex items-center justify-between">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.bg} ${c.text}`}>
                      <Layers className="h-5 w-5" />
                    </span>
                    <Chip color={p.color}>{p.level}</Chip>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.desc}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="font-mono text-xs text-muted">{p.chapters} chapters</span>
                    <span className={`inline-flex items-center gap-1 text-sm font-medium ${c.text}`}>
                      Start path <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Mathematics Subjects  (with sticky jump sidebar)                    */
/* ------------------------------------------------------------------ */

function Subjects() {
  return (
    <section id="subjects" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow color="violet">Browse By Subject</SectionEyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Mathematics subjects</h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
          {/* Sticky jump sidebar */}
          <Reveal className="hidden lg:block">
            <div className="sticky top-28 rounded-xl2 border border-border bg-white p-5 shadow-softer">
              <p className="font-mono text-xs uppercase tracking-widest text-muted">On this page</p>
              <ul className="mt-4 space-y-1">
                {JUMP_LINKS.map((l) => {
                  const c = TOPIC_COLORS[l.color];
                  return (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        className="group flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-ink-soft transition-colors hover:bg-subtle hover:text-ink"
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${c.solid}`} />
                        {l.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {SUBJECTS.map((s, i) => {
              const c = TOPIC_COLORS[s.color];
              return (
                <Reveal key={s.title} delay={i * 0.06}>
                  <div className="group h-full rounded-xl2 border border-border bg-white p-6 shadow-softer transition-all hover:-translate-y-1 hover:shadow-soft">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.bg} ${c.text}`}>
                      <s.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1 font-mono text-xs text-muted">{s.chapters} chapters</p>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-ink-soft">
                        <span>Mastery</span>
                        <span className="font-mono">{s.mastery}%</span>
                      </div>
                      <div className="mt-2">
                        <ProgressBar value={s.mastery} color={s.color} />
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Popular Chapters                                                    */
/* ------------------------------------------------------------------ */

function PopularChapters() {
  return (
    <section id="chapters" className="relative bg-subtle py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="flex items-end justify-between">
          <div>
            <SectionEyebrow color="success">Trending This Week</SectionEyebrow>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Popular chapters</h2>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_CHAPTERS.map((ch, i) => {
            const c = TOPIC_COLORS[ch.color];
            return (
              <Reveal key={ch.title} delay={i * 0.05}>
                <div className="flex items-center gap-4 rounded-xl2 border border-border bg-white p-5 shadow-softer transition-all hover:-translate-y-1 hover:shadow-soft">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${c.bg} font-mono text-xs font-semibold ${c.text}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{ch.title}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Chip color={ch.color}>{ch.subject}</Chip>
                      <span className="font-mono text-xs text-muted">{ch.learners} learners</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Formula Library                                                     */
/* ------------------------------------------------------------------ */

function FormulaLibrary() {
  return (
    <section id="formulas" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow color="secondary">Quick Reference</SectionEyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Formula library</h2>
          <p className="mt-4 text-ink-soft">Every identity and formula, organized by subject and searchable instantly.</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FORMULA_LIBRARY.map((f, i) => {
            const c = TOPIC_COLORS[f.color];
            return (
              <Reveal key={f.title} delay={i * 0.06}>
                <a
                  href="#"
                  className="flex items-center justify-between rounded-xl2 border border-border bg-white p-6 shadow-softer transition-all hover:-translate-y-1 hover:shadow-soft"
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.bg} ${c.text}`}>
                      <Sigma className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{f.title}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted">{f.count} formulas</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Visual Learning                                                     */
/* ------------------------------------------------------------------ */

function VisualLearning() {
  return (
    <section id="visual" className="relative bg-subtle py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow color="pink">See It To Believe It</SectionEyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Visual learning</h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {VISUAL_LEARNING.map((v, i) => {
            const c = TOPIC_COLORS[v.color];
            return (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="group overflow-hidden rounded-xl2 border border-border bg-white shadow-softer transition-all hover:-translate-y-1 hover:shadow-soft">
                  <div className={`flex h-32 items-center justify-center ${c.bg}`}>
                    <svg viewBox="0 0 300 100" className="h-20 w-full px-8">
                      <motion.path
                        d="M 10 80 C 60 80, 80 20, 120 40 S 200 90, 240 15 S 280 5, 290 5"
                        fill="none"
                        stroke="currentColor"
                        className={c.text}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                      />
                    </svg>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-ink">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.desc}</p>
                    <button className={`mt-4 inline-flex items-center gap-1.5 text-sm font-medium ${c.text}`}>
                      <Eye className="h-4 w-4" />
                      Open explorer
                    </button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Interactive Topics                                                  */
/* ------------------------------------------------------------------ */

function InteractiveTopics() {
  return (
    <section id="interactive" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow color="teal">Learn By Doing</SectionEyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Interactive topics</h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INTERACTIVE_TOPICS.map((t, i) => {
            const c = TOPIC_COLORS[t.color];
            return (
              <Reveal key={t.title} delay={i * 0.06}>
                <div className="group flex h-full flex-col items-center rounded-xl2 border border-border bg-white p-6 text-center shadow-softer transition-all hover:-translate-y-1 hover:shadow-soft">
                  <motion.span
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${c.bg} ${c.text}`}
                    whileHover={{ rotate: 8, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Sparkles className="h-6 w-6" />
                  </motion.span>
                  <h3 className="mt-4 text-sm font-semibold text-ink">{t.title}</h3>
                  <Chip color={t.color} active>{t.subject}</Chip>
                  <span className={`mt-4 text-xs font-medium ${c.text}`}>Try it →</span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Recommended Courses                                                 */
/* ------------------------------------------------------------------ */

function RecommendedCourses() {
  return (
    <section className="relative bg-subtle py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="flex items-end justify-between">
          <div>
            <SectionEyebrow color="violet">Curated For You</SectionEyebrow>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Recommended courses</h2>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {RECOMMENDED_COURSES.map((c0, i) => {
            const c = TOPIC_COLORS[c0.color];
            return (
              <Reveal key={c0.title} delay={i * 0.06}>
                <div className="flex h-full flex-col rounded-xl2 border border-border bg-white p-6 shadow-softer transition-all hover:-translate-y-1 hover:shadow-soft">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.bg} ${c.text}`}>
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-ink">{c0.title}</h3>
                  <div className="mt-2 flex items-center gap-1 text-secondary">
                    <Star className="h-3.5 w-3.5 fill-secondary" />
                    <span className="text-xs font-medium text-ink-soft">{c0.rating}</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-xs text-muted">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{c0.duration}</span>
                    <Chip color={c0.color}>{c0.level}</Chip>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Daily Practice                                                      */
/* ------------------------------------------------------------------ */

function DailyPractice() {
  return (
    <section id="practice" className="relative py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-xl3 bg-gradient-to-br from-primary to-sky px-8 py-14 text-center shadow-glow sm:px-16">
            <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:36px_36px] opacity-[0.08]" />
            <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <span className="relative inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-white">
              <Flame className="h-3.5 w-3.5" />
              12-day streak
            </span>

            <h2 className="relative mt-5 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Today's practice set
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-white/85">
              Three quick problems chosen from the concepts you're still building confidence in.
            </p>

            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-2">
              {DAILY_PRACTICE_SET.map((p) => (
                <span
                  key={p.label}
                  className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-mono text-white"
                >
                  {p.label}
                </span>
              ))}
            </div>

            <div className="relative mt-9 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/solve"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-primary shadow-soft transition-transform hover:-translate-y-0.5"
              >
                Start today's set
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Recent Tutorials                                                    */
/* ------------------------------------------------------------------ */

function RecentTutorials() {
  return (
    <section className="relative bg-subtle py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="flex items-end justify-between">
          <div>
            <SectionEyebrow color="sky">Fresh Explanations</SectionEyebrow>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Recent tutorials</h2>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {RECENT_TUTORIALS.map((t, i) => {
            const c = TOPIC_COLORS[t.color];
            return (
              <Reveal key={t.title} delay={i * 0.06}>
                <div className="group overflow-hidden rounded-xl2 border border-border bg-white shadow-softer transition-all hover:-translate-y-1 hover:shadow-soft">
                  <div className={`relative flex h-28 items-center justify-center ${c.bg}`}>
                    <span className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/80 ${c.text} shadow-soft transition-transform group-hover:scale-110`}>
                      <Video className="h-4.5 w-4.5" />
                    </span>
                    <span className="absolute bottom-2 right-2 rounded-md bg-ink/70 px-1.5 py-0.5 font-mono text-[10px] text-white">
                      {t.duration}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-sm font-semibold leading-snug text-ink">{t.title}</p>
                    <div className="mt-3">
                      <Chip color={t.color}>{t.subject}</Chip>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Learning Statistics                                                 */
/* ------------------------------------------------------------------ */

function LearningStatistics() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow color="primary">Your Progress</SectionEyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Learning statistics</h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-8 rounded-xl3 border border-border bg-white p-10 shadow-softer md:grid-cols-4">
          {LEARNING_STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <Counter value={s.value} suffix={s.suffix} color={s.color} />
              <p className="mt-2 text-sm text-ink-soft">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Achievements                                                        */
/* ------------------------------------------------------------------ */

function Achievements() {
  return (
    <section className="relative bg-subtle py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow color="secondary">Milestones</SectionEyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Achievements</h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((a, i) => {
            const c = TOPIC_COLORS[a.color];
            return (
              <Reveal key={a.title} delay={i * 0.06}>
                <div
                  className={`flex items-center gap-4 rounded-xl2 border p-6 shadow-softer transition-all ${
                    a.unlocked ? "border-border bg-white hover:-translate-y-1 hover:shadow-soft" : "border-border bg-white/60 opacity-70"
                  }`}
                >
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${a.unlocked ? c.bg : "bg-subtle"} ${a.unlocked ? c.text : "text-muted"}`}>
                    {a.unlocked ? <Trophy className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{a.title}</p>
                    <p className="mt-1 text-xs text-ink-soft">{a.desc}</p>
                  </div>
                  {a.unlocked && <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-success" />}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Recently Viewed + Bookmarked Lessons                                */
/* ------------------------------------------------------------------ */

function RecentlyViewedAndBookmarks() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-muted" />
              <h3 className="text-lg font-semibold text-ink">Recently viewed</h3>
            </div>
            <div className="mt-5 space-y-3">
              {RECENTLY_VIEWED.map((r) => {
                const c = TOPIC_COLORS[r.color];
                return (
                  <div key={r.title} className="flex items-center justify-between rounded-xl2 border border-border bg-white px-5 py-4 shadow-softer">
                    <div className="flex items-center gap-3">
                      <span className={`h-2 w-2 rounded-full ${c.solid}`} />
                      <div>
                        <p className="text-sm font-medium text-ink">{r.title}</p>
                        <p className="text-xs text-muted">{r.subject}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted">{r.time}</span>
                  </div>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex items-center gap-2">
              <BookmarkCheck className="h-4 w-4 text-muted" />
              <h3 className="text-lg font-semibold text-ink">Bookmarked lessons</h3>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {BOOKMARKED_LESSONS.map((b) => {
                const c = TOPIC_COLORS[b.color];
                return (
                  <div key={b.title} className="flex items-start justify-between gap-3 rounded-xl2 border border-border bg-white p-5 shadow-softer">
                    <div>
                      <p className="text-sm font-medium text-ink">{b.title}</p>
                      <div className="mt-2">
                        <Chip color={b.color}>{b.subject}</Chip>
                      </div>
                    </div>
                    <Bookmark className={`h-4 w-4 shrink-0 fill-current ${c.text}`} />
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                 */
/* ------------------------------------------------------------------ */

export default function LearnPage() {
  return (
    <main className="relative min-h-screen bg-white bg-noise">
      <Navbar />
      <LearnHero />
      <ContinueLearning />
      <LearningPaths />
      <Subjects />
      <PopularChapters />
      <FormulaLibrary />
      <VisualLearning />
      <InteractiveTopics />
      <RecommendedCourses />
      <DailyPractice />
      <RecentTutorials />
      <LearningStatistics />
      <Achievements />
      <RecentlyViewedAndBookmarks />
      <Footer />
    </main>
  );
}