"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Heart, ChevronDown, Sun, Moon, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import ProfileDropDwoun from "../pofile/profileDropDwoun";

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const pathname = usePathname();
  const { data: session, error } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#eadbd8] bg-[#fffaf7]/95 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#160e13]/95 h-15">
      {/* Background Decoration */}
      <nav className="mx-auto flex items-center justify-between gap-5 px-4 py-3 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1 text-[#720e32] dark:text-[#ff9bb9]"
        >
          <Heart
          size={30}
            strokeWidth={2.5}
            className="fill-[#720e32]/5 dark:fill-[#ff9bb9]/10"
          />

          <span className="text-xl font-bold tracking-tight sm:text-3xl">
            WedPlan
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex relative">
          <Link
            href="/"
            className={`relative py-2 text-base font-semibold ${pathname === "/" ? "text-[#720e32] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-[#720e32] dark:text-[#ff9bb9] dark:after:bg-[#ff9bb9]" : "text-gray-700 dark:text-gray-200"}`}
          >
            Home
          </Link>

          
            <Link
            href="/services"
              className={`flex items-center gap-1 py-2 text-base font-semibold ${pathname === "/services" || pathname === "/services/venues" || pathname === "/services/photography" ? "text-[#720e32] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-[#720e32] dark:text-[#ff9bb9] dark:after:bg-[#ff9bb9]" : "text-gray-700 dark:text-gray-200"}`}
            >
              Browse Services
            </Link>

          <Link
            href="/about"
            className={`relative py-2 text-base font-semibold ${pathname === "/about" ? "text-[#720e32] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-[#720e32] dark:text-[#ff9bb9] dark:after:bg-[#ff9bb9]" : "text-gray-700 dark:text-gray-200"}`}
          >
            About
          </Link>

          <Link
            href="/contact"
            className={`relative py-2 text-base font-semibold ${pathname === "/contact" ? "text-[#720e32] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-[#720e32] dark:text-[#ff9bb9] dark:after:bg-[#ff9bb9]" : "text-gray-700 dark:text-gray-200"}`}
          >
            Contact
          </Link>
        </div>

        {/* Right Actions */}
        <div className="hidden shrink-0 items-center gap-3 sm:flex">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm transition hover:border-[#720e32] dark:border-white/10 dark:bg-[#281b24] dark:text-white dark:hover:border-[#ff9bb9]"
          >
            {mounted &&
              (theme === "dark" ? <Sun size={20} /> : <Moon size={21} />)}
          </button>

          {/* Sign In */}
          {user ? (
            <>
              <ProfileDropDwoun />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-xl border border-[#720e32]/40 bg-white px-5 py-1 text-base font-bold text-[#720e32] transition hover:bg-[#720e32] hover:text-white dark:border-[#ff9bb9]/40 dark:bg-transparent dark:text-[#ffb0c5] dark:hover:bg-[#720e32]"
              >
                Sign In
              </Link>

              {/* Sign Up */}
              <Link
                href="/sign-up"
                className="rounded-xl bg-[#720e32] px-5 py-1 text-base font-bold text-white shadow-md transition hover:bg-[#570a26] dark:bg-[#a52b50] dark:hover:bg-[#c13b64]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 dark:border-white/10 dark:bg-[#281b24] dark:text-white"
          >
            {mounted &&
              (theme === "dark" ? <Sun size={19} /> : <Moon size={19} />)}
          </button>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#720e32] text-white dark:bg-[#a52b50]"
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenu && (
        <div className="border-t border-gray-200 bg-[#fffaf7] px-5 py-5 dark:border-white/10 dark:bg-[#160e13] sm:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setMobileMenu(false)}
              className="font-semibold text-[#720e32] dark:text-[#ff9bb9]"
            >
              Home
            </Link>

            <Link
              href="/services"
              className="font-medium text-gray-700 dark:text-gray-200"
            >
              Browse Services
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileMenu(false)}
              className="font-medium text-gray-700 dark:text-gray-200"
            >
              About
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileMenu(false)}
              className="font-medium text-gray-700 dark:text-gray-200"
            >
              Contact
            </Link>

            <div className="flex gap-3 border-t border-gray-200 pt-4 dark:border-white/10">
              <Link
                href="/sign-in"
                className="flex-1 rounded-lg border border-[#720e32] py-2.5 text-center font-semibold text-[#720e32] dark:border-[#ff9bb9] dark:text-[#ff9bb9]"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="flex-1 rounded-lg bg-[#720e32] py-2.5 text-center font-semibold text-white dark:bg-[#a52b50]"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
