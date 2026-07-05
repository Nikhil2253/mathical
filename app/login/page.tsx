"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, RadicalIcon, Sigma, TriangleAlert } from "lucide-react";

import { loginUser, AuthError } from "@/_actions_/auth.action";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginUser({ email, password });
      router.push("/solve");
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError("Unable to reach Mathical. Check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white bg-noise px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full bg-primary/20 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute bottom-0 left-[-10%] h-[380px] w-[380px] rounded-full bg-sky/15 blur-3xl animate-blob [animation-delay:3s]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <a href="/" className="mb-8 flex items-center justify-center gap-2">
          <img src="/mathical-logo.png" alt="" className="w-[50%]" />
        </a>

        <div className="rounded-xl3 border border-border bg-white/90 p-8 shadow-soft backdrop-blur-md sm:p-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white px-3 py-1 font-mono text-xs uppercase tracking-widest text-primary">
            <Sigma className="h-3.5 w-3.5" />
            Welcome back
          </span>

          <h1 className="mt-5 text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Log in to keep solving
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Pick up where you left off, with your full solve history intact.
          </p>

          {error && (
            <div className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-muted">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-xs font-medium uppercase tracking-wide text-muted">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 pr-11 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink-soft"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-white shadow-glow transition-transform hover:-translate-y-0.5 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? "Logging in…" : "Log in"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-ink-soft">
            New to Mathical?{" "}
            <a href="/register" className="font-medium text-primary hover:text-primary-dark">
              Create an account
            </a>
          </p>
        </div>
      </motion.div>
    </main>
  );
}