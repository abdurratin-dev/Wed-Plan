"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { GiLoveMystery } from "react-icons/gi";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";

type Errors = Partial<Record<"email" | "password", string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const next: Errors = {};
    if (!emailPattern.test(email.trim()))
      next.email = "Please enter a valid email address";
    if (!password) next.password = "Please enter your password";

    setErrors(next);
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (data) {
      toast.add({
        type: "success",
        description: `Welcome back ${data.user.name}`,
      });
      return router.push(`/dashboard/${data.user.role}`);
    }
    toast.add({
      type: "error",
      description: error.message,
    });
  }

  const hendleGoogleButton = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  const fieldClass = (invalid?: string) =>
    cn(
      "w-full rounded-xl border bg-[#fdfbfa] px-4 py-3.5 text-sm text-[#2b0713] outline-none transition placeholder:text-[#a89a9f] focus:border-[#720e32] focus:ring-2 focus:ring-[#720e32]/15 dark:bg-[#241720] dark:text-white dark:placeholder:text-[#8d7a84] dark:focus:border-[#ff9bb9] dark:focus:ring-[#ff9bb9]/15",
      invalid
        ? "border-[#d6455f] focus:border-[#d6455f] focus:ring-[#d6455f]/20"
        : "border-[#eee2dd] dark:border-white/10",
    );

  return (
    <div className="relative grid grid-cols-1 overflow-hidden bg-gradient-to-br from-[#fff8f4] via-[#fdf1eb] to-[#fae7de] lg:min-h-[calc(100vh-76px)] lg:grid-cols-2 dark:from-[#1b1118] dark:via-[#160e13] dark:to-[#22141c]">
      {/* Soft background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-16 top-10 h-64 w-64 rounded-full bg-rose-200/50 blur-3xl dark:bg-rose-950/40" />
        <div className="absolute bottom-0 left-1/4 h-56 w-64 rounded-full bg-orange-100/70 blur-3xl dark:bg-[#a52b50]/10" />
      </div>

      {/* Photo — desktop: left half */}
      <div className="relative hidden lg:block">
        <Image
          src="https://img.magnific.com/premium-photo/wedding-ceremony-newlyweds-pier_419896-19746.jpg?semt=ais_hybrid&w=740&q=80"
          alt="Blush pink wedding roses"
          fill
          priority
          sizes="50vw"
          className="object-cover object-center dark:brightness-[0.78] dark:saturate-[0.9]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fdf1eb]/45 via-transparent to-[#fdf1eb] dark:from-[#160e13]/55 dark:to-[#160e13]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#fdf1eb]/60 to-transparent dark:from-[#160e13]/60" />
      </div>

      {/* Photo — mobile: banner above the form */}
      <div className="relative h-40 w-full overflow-hidden sm:h-48 lg:hidden">
        <Image
          src="/auth-bg.jpg"
          alt="Blush pink wedding roses"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center dark:brightness-[0.78] dark:saturate-[0.9]"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#fdf1eb] to-transparent dark:from-[#160e13]" />
      </div>

      {/* Form */}
      <div className="relative flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12 lg:py-14 xl:px-20">
        <div className="w-full max-w-md rounded-3xl border border-[#f1ded7] bg-white p-6 shadow-[0_28px_60px_-32px_rgba(114,14,50,0.45)] sm:p-8 dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none">
          {/* Logo */}
          <Link
            href="/"
            className="mb-7 flex items-center justify-center gap-1 text-[#720e32] dark:text-[#ff9bb9]"
          >
            <GiLoveMystery size={30} strokeWidth={2.5} />
            <span className="text-2xl font-extrabold tracking-tight">
              WedPlan
            </span>
          </Link>

          <div className="mb-7 text-center">
            <h1 className="text-[1.7rem] font-bold leading-tight tracking-tight text-[#2b0713] sm:text-3xl dark:text-[#ffeaf1]">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-[#6b5a61] sm:text-[0.95rem] dark:text-[#c8b3bd]">
              Sign in to continue planning your dream wedding
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                aria-invalid={!!errors.email}
                className={fieldClass(errors.email)}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-[#d6455f]">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="mb-1.5 ml-auto text-xs font-semibold text-[#720e32] transition hover:underline dark:text-[#ff9bb9]"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  aria-invalid={!!errors.password}
                  className={cn(fieldClass(errors.password), "pr-12")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#a89a9f] transition hover:text-[#720e32] dark:text-[#8d7a84] dark:hover:text-[#ff9bb9]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs font-medium text-[#d6455f]">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            {loading ? (
              <button
                type="submit"
                disabled
                className="flex w-full items-center justify-center rounded-xl bg-[#720e32] py-3.5 text-[0.95rem] font-bold text-white shadow-md transition hover:bg-[#570a26] disabled:opacity-70 disabled:cursor-wait dark:bg-[#a52b50] dark:hover:bg-[#c13b64]"
              >
                <Spinner className="size-6" />
              </button>
            ) : (
              <button
                type="submit"
                className="w-full rounded-xl bg-[#720e32] py-3.5 text-[0.95rem] font-bold text-white shadow-md transition hover:bg-[#570a26] dark:bg-[#a52b50] dark:hover:bg-[#c13b64]"
              >
                Sign In
              </button>
            )}

            {submitted && (
              <p className="rounded-xl border border-[#e3c3bd] bg-[#fdf1eb] px-4 py-3 text-center text-xs font-medium leading-relaxed text-[#720e32] dark:border-[#a52b50]/40 dark:bg-[#2f1e28] dark:text-[#ffb0c5]">
                Looks good — authentication isn&apos;t connected yet, so you
                aren&apos;t signed in.
              </p>
            )}
          </form>

          {/* Or divider */}
          <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground dark:text-[#c8b3bd]">
            <span className="h-px flex-1 bg-[#efe2dd] dark:bg-white/10" />
            <span className="font-semibold uppercase tracking-wider">or</span>
            <span className="h-px flex-1 bg-[#efe2dd] dark:bg-white/10" />
          </div>

          {/* Google sign-in */}
          <button
            type="button"
            onClick={hendleGoogleButton}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-[#eee2dd] bg-white px-4 py-3.5 text-sm font-semibold text-[#2b0713] shadow-sm transition hover:border-[#e0cdc6] hover:bg-[#fdfbfa] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#720e32] dark:border-white/10 dark:bg-[#241720] dark:text-[#ffeaf1] dark:hover:border-white/20 dark:hover:bg-[#2a1b24] dark:focus-visible:outline-[#ff9bb9]"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-5 shrink-0"
            >
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29A11.99 11.99 0 0 0 0 12c0 1.94.46 3.77 1.29 5.38l3.98-3.09z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
              />
            </svg>
            Sign in with Google
          </button>

          <p className="mt-6 text-center text-sm text-[#6b5a61] dark:text-[#c8b3bd]">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-bold text-[#720e32] transition hover:underline dark:text-[#ff9bb9]"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
