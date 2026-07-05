"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence, animate } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Play,
  Upload,
  ListTree,
  Shapes,
  LineChart,
  ShieldCheck,
  Target,
  ChevronDown,
  Star,
  Check,
  X as XIcon,
  GitBranch,
  Link,
  Menu,
  X as CloseIcon,
  RadicalIcon,
  Sigma,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Color system                                                       */
/*  Every recurring math topic keeps one accent color across the page: */
/*  Algebra = sky, Calculus = violet, Statistics = success,            */
/*  Geometry = secondary (amber), Linear Algebra = pink,               */
/*  Differential Equations = teal.                                     */
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

/* ------------------------------------------------------------------ */
/*  Shared data                                                        */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Demo", href: "#demo" },
  { label: "FAQ", href: "#faq" },
];

const TRUSTED_BY = ["Students", "Teachers", "Universities", "Researchers"];

const FEATURES: { icon: any; title: string; desc: string; color: TopicColor; chips?: { label: string; color: TopicColor }[] }[] = [
  {
    icon: Upload,
    title: "AI Problem Solver",
    desc: "Upload a photo or type any mathematical question — from a fraction to a tensor.",
    color: "sky",
  },
  {
    icon: ListTree,
    title: "Step-by-Step Solutions",
    desc: "Every step explained like a personal tutor, never just a final answer.",
    color: "violet",
  },
  {
    icon: Shapes,
    title: "Smart Classification",
    desc: "Automatically detects the topic so the explanation matches the method.",
    color: "secondary",
    chips: [
      { label: "Algebra", color: "sky" },
      { label: "Calculus", color: "violet" },
      { label: "Statistics", color: "success" },
      { label: "Geometry", color: "secondary" },
      { label: "Linear Algebra", color: "pink" },
      { label: "Diff. Equations", color: "teal" },
    ],
  },
  {
    icon: LineChart,
    title: "Interactive Graphs",
    desc: "Beautiful, accurate graphs generated for functions and statistical problems.",
    color: "teal",
  },
  {
    icon: ShieldCheck,
    title: "AI Verification",
    desc: "Every solution is checked by a second reasoning pass before it reaches you.",
    color: "success",
  },
  {
    icon: Target,
    title: "Personalized Practice",
    desc: "Unlimited similar questions generated from the concepts you're weakest on.",
    color: "pink",
  },
];

const STEPS: { n: string; title: string; desc: string; color: TopicColor }[] = [
  { n: "01", title: "Ask your question", desc: "Type it, paste it, or snap a photo of the problem.", color: "primary" },
  { n: "02", title: "AI understands the topic", desc: "Mathical classifies the concept and chooses a method.", color: "sky" },
  { n: "03", title: "Step-by-step explanation", desc: "Every line of reasoning is shown and justified.", color: "violet" },
  { n: "04", title: "Practice & master it", desc: "Similar problems are generated until it clicks.", color: "pink" },
];

const DEMO_TABS = [
  {
    key: "classification",
    label: "Classification",
    render: () => (
      <div className="space-y-3">
        <p className="text-sm text-ink-soft">Detected topic</p>
        <div className="flex flex-wrap gap-2">
          <Chip color="violet" active>Calculus</Chip>
          <Chip color="violet">Integration by Parts</Chip>
          <Chip color="violet">Definite &amp; Indefinite</Chip>
        </div>
        <p className="pt-2 text-sm text-ink-soft">
          Confidence <span className="font-mono text-ink">98.4%</span>
        </p>
      </div>
    ),
  },
  {
    key: "plan",
    label: "Plan",
    render: () => (
      <ol className="space-y-2 text-sm text-ink-soft">
        <li><span className="font-mono text-sky mr-2">1</span>Recognize product of x² and eˣ</li>
        <li><span className="font-mono text-violet mr-2">2</span>Apply integration by parts twice</li>
        <li><span className="font-mono text-pink mr-2">3</span>Simplify and combine terms</li>
        <li><span className="font-mono text-teal mr-2">4</span>Add constant of integration</li>
      </ol>
    ),
  },
  {
    key: "steps",
    label: "Steps",
    render: () => (
      <div className="space-y-3 text-sm text-ink-soft">
        <p><span className="font-mono text-ink">u = x², dv = eˣ dx</span> → first pass</p>
        <p><span className="font-mono text-ink">du = 2x dx, v = eˣ</span></p>
        <p><span className="font-mono text-ink">∫x²eˣdx = x²eˣ − 2∫xeˣdx</span></p>
        <p>Repeat by parts on <span className="font-mono text-ink">∫xeˣdx</span></p>
      </div>
    ),
  },
  {
    key: "latex",
    label: "LaTeX",
    render: () => (
      <pre className="whitespace-pre-wrap rounded-xl bg-ink text-white/90 p-4 text-xs leading-relaxed font-mono">
{`x^2 e^x - 2xe^x + 2e^x + C`}
          </pre>
    ),
  },
  {
    key: "graph",
    label: "Graph",
    render: () => <MiniGraph />,
  },
  {
    key: "answer",
    label: "Answer",
    render: () => (
      <div className="rounded-xl border border-success/25 bg-success-light p-4">
        <p className="font-mono text-lg text-ink">x²eˣ − 2xeˣ + 2eˣ + C</p>
      </div>
    ),
  },
  {
    key: "verified",
    label: "Verified",
    render: () => (
      <div className="flex items-center gap-3 rounded-xl border border-success/25 bg-success-light p-4">
        <ShieldCheck className="h-5 w-5 shrink-0 text-success" />
        <p className="text-sm text-ink-soft">
          Re-derived independently and matched — <span className="text-success font-medium">verified</span>.
        </p>
      </div>
    ),
  },
  {
    key: "practice",
    label: "Practice",
    render: () => (
      <ul className="space-y-2 text-sm text-ink-soft">
        <li className="rounded-lg border border-sky/25 bg-sky-light/50 px-3 py-2 font-mono">∫x³eˣ dx</li>
        <li className="rounded-lg border border-violet/25 bg-violet-light/50 px-3 py-2 font-mono">∫x²sin(x) dx</li>
        <li className="rounded-lg border border-pink/25 bg-pink-light/50 px-3 py-2 font-mono">∫x²ln(x) dx</li>
      </ul>
    ),
  },
];

const COMPARISON = [
  { trad: "Memorization", math: "AI tutor that reasons with you" },
  { trad: "No instant help", math: "Instant feedback, any hour" },
  { trad: "Static textbooks", math: "Interactive, worked graphs" },
  { trad: "No visualization", math: "Personalized practice sets" },
  { trad: "One-size-fits-all pace", math: "Explanations for every concept" },
];

const STATS: { value: number; suffix: string; label: string; raw?: boolean; color: TopicColor }[] = [
  { value: 50, suffix: "+", label: "Problems Solved", color: "primary" },
  { value: 98, suffix: "%", label: "Verified Accuracy", color: "success" },
  { value: Infinity, suffix: "", label: "Math Topics", color: "violet" },
  { value: 0, suffix: "24/7", label: "AI Tutor", raw: true, color: "secondary" },
];

const TESTIMONIALS: { name: string; role: string; quote: string; initials: string; color: TopicColor }[] = [
  {
    name: "Amara Okafor",
    role: "Undergraduate, Applied Mathematics",
    quote:
      "I finally understand why the steps work, not just what they are. Mathical explains the reasoning my textbook skipped.",
    initials: "AO",
    color: "sky",
  },
  {
    name: "Daniel Kim",
    role: "High School Senior",
    quote:
      "The graphs make abstract functions click instantly. It feels like having a patient tutor at 2am before an exam.",
    initials: "DK",
    color: "violet",
  },
  {
    name: "Priya Menon",
    role: "Mathematics Teacher",
    quote:
      "I recommend it to students who need extra practice. The verification step means I trust what it shows them.",
    initials: "PM",
    color: "pink",
  },
];

const FAQS = [
  {
    q: "Which math topics are supported?",
    a: "Everything from arithmetic and pre-algebra through calculus, linear algebra, statistics, differential equations, and select university-level topics — 40+ areas in total.",
  },
  {
    q: "Is it free?",
    a: "You can start solving problems for free. Higher usage and advanced features are available on paid plans.",
  },
  {
    q: "Does it show every step?",
    a: "Yes. Mathical never skips a step — each line of reasoning is explained the way a tutor would walk you through it.",
  },
  {
    q: "Can I use it for university mathematics?",
    a: "Yes. Mathical covers university-level topics including multivariable calculus, linear algebra, and differential equations.",
  },
  {
    q: "Are answers verified?",
    a: "Every solution is independently re-derived and checked by a verification pass before it's shown to you.",
  },
];

/* ------------------------------------------------------------------ */
/*  Small shared UI pieces                                             */
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
        active
          ? `${c.border} ${c.bg} ${c.text}`
          : "border-border bg-white text-ink-soft"
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

function MiniGraph() {
  return (
    <svg viewBox="0 0 300 160" className="w-full h-40">
      <defs>
        <linearGradient id="graph-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4147E8" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <line x1="10" y1="130" x2="290" y2="130" stroke="#E7E9F2" strokeWidth="1.5" />
      <line x1="20" y1="10" x2="20" y2="150" stroke="#E7E9F2" strokeWidth="1.5" />
      <motion.path
        d="M 20 130 C 60 130, 80 40, 120 60 S 200 130, 240 20 S 280 10, 290 10"
        fill="none"
        stroke="url(#graph-stroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
    </svg>
  );
}

function Counter({ value, suffix, raw, color = "primary" }: { value: number; suffix: string; raw?: boolean; color?: TopicColor }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);
  const c = TOPIC_COLORS[color];

  useEffect(() => {
    if (!inView || raw) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) {
        setDisplay(Math.floor(v));
      },
    });
    return () => controls.stop();
  }, [inView, value, raw]);

  if (raw) {
    return (
      <span ref={ref} className={`font-mono text-4xl md:text-5xl font-semibold ${c.text}`}>
        {suffix}
      </span>
    );
  }

  return (
    <span ref={ref} className={`font-mono text-4xl md:text-5xl font-semibold ${c.text}`}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Sections                                                           */
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
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-border shadow-softer"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="#" className="flex items-center gap-2">
          <img src="/mathical-logo.png" alt="" className="w-[200px] h-[60px]" />
        </a>

        <div className="hidden items-center gap-8 md:flex">
  {NAV_LINKS.map((l) => (
    <a
      key={l.href}
      href={l.href}
      className="
        relative
        text-sm
        text-[#1A237E]
        transition-colors
        duration-300
        hover:text-ink
        after:absolute
        after:left-0
        after:-bottom-1
        after:h-[2px]
        after:w-full
        after:origin-left
        after:scale-x-0
        after:bg-[#1A237E]
        after:transition-transform
        after:duration-300
        hover:after:scale-x-100
      "
    >
      {l.label}
    </a>
  ))}
</div>

        <div className="hidden items-center gap-3 md:flex">
          <a href="/login" className="text-sm text-white  transition-colors px-4 py-2 rounded-full  bg-gradient-to-r from-primary to-sky hover:opacity-50 transition-transform hover:-translate-y-0.5">
            Log in
          </a>
          <a
            href="/solve"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-primary-dark"
          >
            Start Solving Free
          </a>
        </div>

        <button
          className="md:hidden text-ink"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
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
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-ink-soft"
                >
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

function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24 lg:pt-44 lg:pb-32">
      {/* Faint grid-paper backdrop — the page's recurring motif */}
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,black,transparent)]" />

      {/* Ambient gradient blobs — now multi-hued */}
      <div className="pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full bg-primary/20 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute top-40 left-[-10%] h-[380px] w-[380px] rounded-full bg-pink/15 blur-3xl animate-blob [animation-delay:3s]" />
      <div className="pointer-events-none absolute bottom-0 right-[20%] h-[300px] w-[300px] rounded-full bg-teal/15 blur-3xl animate-blob [animation-delay:5s]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SectionEyebrow>AI Mathematics Tutor</SectionEyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            Learn Mathematics with an{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-sky bg-clip-text text-transparent">
              AI That Actually Teaches
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft"
          >
            From basic arithmetic to advanced university mathematics. Solve problems
            step-by-step, understand every concept, visualize solutions, and practice
            intelligently.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="/solve"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-white shadow-glow transition-transform hover:-translate-y-0.5 hover:bg-primary-dark"
            >
              Start Solving Free
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/demo"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3.5 text-sm font-medium text-ink transition-all hover:-translate-y-0.5 hover:border-primary/30"
            >
              <Play className="h-4 w-4" />
              Watch Demo
            </a>
          </motion.div>
        </div>

        {/* Right-side illustration */}
        <div className="relative h-[440px] lg:h-[520px]">
          {/* Traced function curve */}
          <svg viewBox="0 0 480 480" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="hero-curve" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4147E8" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <path
              d="M 30 380 C 110 380, 140 200, 220 220 S 340 380, 420 120"
              fill="none"
              stroke="url(#hero-curve)"
              strokeOpacity="0.45"
              strokeWidth="2.5"
              strokeDasharray="620"
              strokeDashoffset="620"
              className="animate-draw"
              strokeLinecap="round"
            />
          </svg>

          <motion.div
            className="absolute left-2 top-6 w-64 rounded-2xl border border-border bg-white/90 p-5 shadow-soft backdrop-blur-md"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary to-violet text-white">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <p className="text-xs font-medium text-ink-soft">AI Assistant</p>
            </div>
            <p className="font-mono text-sm text-ink">∫ x²eˣ dx</p>
            <p className="mt-2 font-mono text-xs text-ink-soft">
              = x²eˣ − 2xeˣ + 2eˣ + C
            </p>
          </motion.div>

          <motion.div
            className="absolute right-0 top-32 w-56 rounded-2xl border border-border bg-white/90 p-4 shadow-soft backdrop-blur-md"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <p className="mb-2 text-xs font-medium text-ink-soft">Graph Preview</p>
            <MiniGraph />
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-10 w-60 rounded-2xl border border-success/25 bg-success-light/90 p-4 shadow-soft backdrop-blur-md"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success" />
              <p className="text-xs font-medium text-ink">Solution verified</p>
            </div>
            <div className="mt-2 flex gap-1.5">
              <Chip color="success" active>Step 3 / 3</Chip>
            </div>
          </motion.div>

          {/* Floating geometric shapes — each a different accent */}
          <div className="absolute right-10 bottom-4 h-14 w-14 rounded-2xl border-2 border-secondary/50 animate-float-slow" />
          <div className="absolute right-24 top-0 h-10 w-10 rounded-full border-2 border-sky/40 animate-float" />
          <div className="absolute left-0 bottom-32 h-8 w-8 rotate-45 border-2 border-teal/40 animate-float-slow" />
          <div className="absolute left-24 top-24 h-6 w-6 rounded-full border-2 border-pink/40 animate-float" />
        </div>
      </div>
    </section>
  );
}

function TrustedBy() {
  const colors: TopicColor[] = ["sky", "violet", "secondary", "teal"];
  return (
    <section className="border-y border-border bg-subtle py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center font-mono text-xs uppercase tracking-widest text-muted">
          Trusted by learners around the world
        </p>
        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {TRUSTED_BY.map((t, i) => (
            <div
              key={t}
              className="flex items-center justify-center gap-2 text-ink-soft opacity-80 transition-opacity hover:opacity-100"
            >
              <Sigma className={`h-4 w-4 ${TOPIC_COLORS[colors[i % colors.length]].text}`} />
              <span className="text-sm font-medium tracking-wide">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Capabilities</SectionEyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Everything you need to actually understand math
          </h2>
          <p className="mt-4 text-ink-soft">
            Not just answers — reasoning, visuals, and verification at every step.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const c = TOPIC_COLORS[f.color];
            return (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="group h-full rounded-lg border border-sky-100 bg-white p-7 shadow-softer transition-all hover:-translate-y-1 hover:shadow-soft hover:border-gray-300">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.bg} ${c.text} transition-colors `}>
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.desc}</p>
                  {f.chips && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {f.chips.map((chip) => (
                        <Chip key={chip.label} color={chip.color}>{chip.label}</Chip>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-subtle py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>The Process</SectionEyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            How it works
          </h2>
        </Reveal>

        <div className="relative mt-16 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-11 hidden h-px bg-border md:block" />
          {STEPS.map((s, i) => {
            const c = TOPIC_COLORS[s.color];
            return (
              <Reveal key={s.n} delay={i * 0.1} className="relative">
                <div className="rounded-xl2 border border-border bg-white p-6 shadow-softer">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full ${c.solid} font-mono text-xs font-semibold text-white`}>
                    {s.n}
                  </span>
                  <h3 className="mt-4 font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="mt-3 flex justify-center md:absolute md:right-[-22px] md:top-8 md:mt-0">
                    <ArrowRight className={`h-4 w-4 rotate-90 md:rotate-0 ${c.text} opacity-60`} />
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Demo() {
  const [active, setActive] = useState(DEMO_TABS[0].key);
  const activeTab = DEMO_TABS.find((t) => t.key === active)!;

  return (
    <section id="demo" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Live Inside Mathical</SectionEyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Ask a question. Watch the reasoning unfold.
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-14">
          <div className="overflow-hidden rounded-xl3 border border-border bg-white shadow-soft">
            {/* Editor top bar */}
            <div className="flex items-center gap-2 border-b border-border bg-subtle px-5 py-3.5">
              <span className="h-3 w-3 rounded-full bg-[#FF6159]" />
              <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
              <span className="h-3 w-3 rounded-full bg-[#28CA41]" />
              <span className="ml-3 font-mono text-xs text-muted">mathical — solve.ai</span>
            </div>

            {/* Prompt line */}
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <span className="font-mono text-primary">›</span>
              <span className="font-mono text-sm text-ink">Integrate x²eˣ dx</span>
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-sky px-3 py-1.5 text-xs font-medium text-white">
                Solve <ArrowRight className="h-3 w-3" />
              </span>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1 border-b border-border px-3 py-2">
              {DEMO_TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    active === t.key
                      ? "bg-primary-light text-primary"
                      : "text-ink-soft hover:bg-subtle hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Panel */}
            <div className="min-h-[220px] p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {activeTab.render()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Comparison() {
  return (
    <section className="relative bg-subtle py-28">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Why Mathical</SectionEyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Not another textbook
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-14 overflow-hidden rounded-xl3 border border-border bg-white shadow-softer">
          <div className="grid grid-cols-2">
            <div className="border-r border-border p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-widest text-muted">
                Traditional Learning
              </p>
              <ul className="mt-6 space-y-4">
                {COMPARISON.map((c) => (
                  <li key={c.trad} className="flex items-start gap-3 text-sm text-ink-soft">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50">
                      <XIcon className="h-3 w-3 text-red-400" />
                    </span>
                    {c.trad}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary via-sky to-sky p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-widest text-white">
                Mathical
              </p>
              <ul className="mt-6 space-y-4">
                {COMPARISON.map((c) => (
                  <li key={c.math} className="flex items-start gap-3 text-sm font-medium text-ink">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-light">
                      <Check className="h-3 w-3 text-success" />
                    </span>
                    {c.math}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 rounded-xl3 border border-border bg-white p-10 shadow-softer md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <Counter value={s.value} suffix={s.suffix} raw={s.raw} color={s.color} />
              <p className="mt-2 text-sm text-ink-soft">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="relative bg-subtle py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Loved by learners</SectionEyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            What people are saying
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => {
            const c = TOPIC_COLORS[t.color];
            return (
              <Reveal key={t.name} delay={i * 0.08}>
                <div className="h-full rounded-xl2 border border-border bg-white p-7 shadow-softer">
                  <div className="flex gap-1 text-secondary">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-secondary" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ink-soft">"{t.quote}"</p>
                  <div className="mt-6 flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-full ${c.bg} font-mono text-xs font-semibold ${c.text}`}>
                      {t.initials}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink">{t.name}</p>
                      <p className="text-xs text-muted">{t.role}</p>
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

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Questions</SectionEyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Frequently asked questions
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.05}>
                <div className="overflow-hidden rounded-xl2 border border-border bg-white">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium text-ink">{f.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-sm leading-relaxed text-ink-soft">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-xl3 bg-gradient-to-br from-primary to-sky px-8 py-16 text-center shadow-glow sm:px-16">
            <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:36px_36px] opacity-[0.08]" />
            <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <h2 className="relative text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Ready to Master Mathematics?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-white/85">
              Join thousands of students learning with AI.
            </p>
            <div className="relative mt-9 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/solve"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-primary shadow-soft transition-transform hover:-translate-y-0.5"
              >
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/demo"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                Explore Demo
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <img src="/mathical-logo.png" alt="" className="w-[200px] h-15"/>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              An AI mathematics tutor that explains every step, verifies every answer.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted">Product</p>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                <li><a href="#features" className="hover:text-ink">Features</a></li>
                <li><a href="#" className="hover:text-ink">Pricing</a></li>
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
                  <Link className="h-4 w-4" />
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
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white bg-noise">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <Demo />
      <Comparison />
      <Stats />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}