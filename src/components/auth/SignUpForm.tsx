"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const roles = [
  {
    label: "Customer",
    value: "customer",
  },
  {
    label: "Vendor",
    value: "vendor",
  },
] as const;
type Role = "customer" | "vendor";

type Errors = Partial<
  Record<"name" | "email" | "password" | "confirmPassword", string>
>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function SignUpForm() {
  const [role, setRole] = useState<Role>("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Please enter your full name";
    if (!emailPattern.test(email.trim()))
      next.email = "Please enter a valid email address";
    if (password.length < 8)
      next.password = "Password must be at least 8 characters";
    if (password !== confirmPassword)
      next.confirmPassword = "Passwords do not match";

    setErrors(next);
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      role,
    });
    if(data){
      setSubmitted(true);
      router.push(`/dashboard/${role}`);
    }
  }

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
          src="/auth-bg.jpg"
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
            <Heart
              size={30}
              strokeWidth={2.5}
              className="fill-[#720e32]/5 dark:fill-[#ff9bb9]/10"
            />
            <span className="text-2xl font-extrabold tracking-tight">
              WedPlan
            </span>
          </Link>

          <div className="mb-7 text-center">
            <h1 className="text-[1.7rem] font-bold leading-tight tracking-tight text-[#2b0713] sm:text-3xl dark:text-[#ffeaf1]">
              Create Your Account
            </h1>
            <p className="mt-2 text-sm text-[#6b5a61] sm:text-[0.95rem] dark:text-[#c8b3bd]">
              Start planning your dream wedding
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Account type */}
            <div
              role="tablist"
              aria-label="Account type"
              className="grid grid-cols-2 gap-1 rounded-2xl bg-[#f7efec] p-1 dark:bg-[#241720]"
            >
              {roles.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  aria-selected={role === item.value}
                  onClick={() => setRole(item.value)}
                  className={cn(
                    "rounded-xl px-2 py-2.5 text-sm font-semibold transition sm:px-3",
                    role === item.value
                      ? "border border-[#e3c3bd] bg-white text-[#720e32] shadow-sm dark:border-[#a52b50]/50 dark:bg-[#2f1e28] dark:text-[#ff9bb9]"
                      : "border border-transparent text-[#8a7a80] hover:text-[#720e32] dark:text-[#9b8792] dark:hover:text-[#ff9bb9]",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Full name */}
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Full Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                aria-invalid={!!errors.name}
                className={fieldClass(errors.name)}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs font-medium text-[#d6455f]">
                  {errors.name}
                </p>
              )}
            </div>

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
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
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
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: undefined,
                    }));
                  }}
                  aria-invalid={!!errors.confirmPassword}
                  className={cn(fieldClass(errors.confirmPassword), "pr-12")}
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
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs font-medium text-[#d6455f]">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <input type="hidden" name="role" value={role} />

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#720e32] py-3.5 text-[0.95rem] font-bold text-white shadow-md transition hover:bg-[#570a26] dark:bg-[#a52b50] dark:hover:bg-[#c13b64]"
            >
              Sign Up
            </button>

            {submitted && (
              <p className="rounded-xl border border-[#e3c3bd] bg-[#fdf1eb] px-4 py-3 text-center text-xs font-medium leading-relaxed text-[#720e32] dark:border-[#a52b50]/40 dark:bg-[#2f1e28] dark:text-[#ffb0c5]">
                Looks good — authentication isn&apos;t connected yet, so no
                account was created.
              </p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-[#6b5a61] dark:text-[#c8b3bd]">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-bold text-[#720e32] transition hover:underline dark:text-[#ff9bb9]"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
