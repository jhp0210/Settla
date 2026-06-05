"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function LoginContent() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, loading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlError = searchParams.get("error");

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function switchMode(next: "signin" | "signup") {
    setMode(next);
    setFormError(null);
    setSuccessMsg(null);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setFormError("Please fill in all fields.");
      return;
    }
    if (mode === "signup") {
      if (password.length < 8) {
        setFormError("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setFormError("Passwords do not match.");
        return;
      }
    }

    setIsSubmitting(true);
    if (mode === "signin") {
      const error = await signInWithEmail(email, password);
      if (error) {
        setFormError(error);
        setIsSubmitting(false);
      } else {
        router.push("/dashboard");
      }
    } else {
      const { error, needsConfirmation } = await signUpWithEmail(email, password);
      setIsSubmitting(false);
      if (error) {
        setFormError(error);
      } else if (needsConfirmation) {
        setSuccessMsg("Check your email for a confirmation link to complete sign-up.");
      } else {
        router.push("/dashboard");
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
            Settla
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white">
            {mode === "signin" ? "Welcome back" : "Create account"}
          </h1>
          <p className="mt-2 text-sm text-white/50">
            {mode === "signin" ? "Sign in to continue" : "Sign up to get started"}
          </p>
        </div>

        {/* URL error (OAuth failure) */}
        {urlError && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            An error occurred during sign-in. Please try again.
          </div>
        )}

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          {/* Mode tabs */}
          <div className="mb-6 flex rounded-lg border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                mode === "signin"
                  ? "bg-indigo-600 text-white"
                  : "text-white/50 hover:text-white/70"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                mode === "signup"
                  ? "bg-indigo-600 text-white"
                  : "text-white/50 hover:text-white/70"
              }`}
            >
              Create account
            </button>
          </div>

          {/* Success message */}
          {successMsg && (
            <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              {successMsg}
            </div>
          )}

          {/* Form error */}
          {formError && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {formError}
            </div>
          )}

          {/* Email/password form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/50">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/50">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "Min. 8 characters" : "••••••••"}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40"
              />
            </div>
            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/50">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40"
                />
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="mt-1 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? mode === "signin" ? "Signing in…" : "Creating account…"
                : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-white/30">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Google */}
          <button
            onClick={signInWithGoogle}
            disabled={loading || isSubmitting}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
