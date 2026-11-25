"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import ProfileDropDwoun from "../pofile/profileDropDwoun";
import { GiLoveMystery } from "react-icons/gi";
import Loading from "@/app/(main)/loading";

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if(!user){
    return <Loading />
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#eadbd8] bg-[#fffaf7]/95 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#160e13]/95 h-15">
      {/* Background Decoration */}
      <nav className="mx-auto max-w-[1600px] flex items-center justify-between gap-5 px-4 py-2 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center justify-center gap-1 rounded-lg text-[#720e32] transition-colors focus-visible:ring-2 focus-visible:ring-[#720e32]/40 dark:text-[#ff9bb9] dark:focus-visible:ring-[#ff9bb9]/40"
        >
          <GiLoveMystery size={30} strokeWidth={2.5} />

          <span className="text-xl font-bold tracking-tight sm:text-3xl">
            WedPlan
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex relative">
          <Link
            href="/"
            className={`relative rounded-lg py-2 text-base font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#720e32]/40 dark:focus-visible:ring-[#ff9bb9]/40 ${pathname === "/" ? "text-[#720e32] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-[#720e32] dark:text-[#ff9bb9] dark:after:bg-[#ff9bb9]" : "text-gray-700 dark:text-gray-200"}`}
          >
            Home
          </Link>

          <Link
            href="/services"
            className={`relative rounded-lg py-2 text-base font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#720e32]/40 dark:focus-visible:ring-[#ff9bb9]/40 ${pathname === "/services" || pathname === "/services/venues" || pathname === "/services/photography" ? "text-[#720e32] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-[#720e32] dark:text-[#ff9bb9] dark:after:bg-[#ff9bb9]" : "text-gray-700 dark:text-gray-200"}`}
          >
            Browse Services
          </Link>

          <Link
            href="/about"
            className={`relative rounded-lg py-2 text-base font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#720e32]/40 dark:focus-visible:ring-[#ff9bb9]/40 ${pathname === "/about" ? "text-[#720e32] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-[#720e32] dark:text-[#ff9bb9] dark:after:bg-[#ff9bb9]" : "text-gray-700 dark:text-gray-200"}`}
          >
            About
          </Link>

          <Link
            href="/contact"
            className={`relative rounded-lg py-2 text-base font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#720e32]/40 dark:focus-visible:ring-[#ff9bb9]/40 ${pathname === "/contact" ? "text-[#720e32] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-[#720e32] dark:text-[#ff9bb9] dark:after:bg-[#ff9bb9]" : "text-gray-700 dark:text-gray-200"}`}
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
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm transition hover:border-[#720e32] focus-visible:ring-2 focus-visible:ring-[#720e32]/40 dark:border-white/10 dark:bg-[#281b24] dark:text-white dark:hover:border-[#ff9bb9] dark:focus-visible:ring-[#ff9bb9]/40"
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
                className="rounded-xl border border-[#720e32]/40 bg-white px-5 py-2.5 text-base font-bold text-[#720e32] transition hover:bg-[#720e32] hover:text-white focus-visible:ring-2 focus-visible:ring-[#720e32]/40 dark:border-[#ff9bb9]/40 dark:bg-transparent dark:text-[#ffb0c5] dark:hover:bg-[#720e32] dark:focus-visible:ring-[#ff9bb9]/40"
              >
                Sign In
              </Link>

              {/* Sign Up */}
              <Link
                href="/sign-up"
                className="rounded-xl bg-[#720e32] px-5 py-2.5 text-base font-bold text-white shadow-md transition hover:bg-[#570a26] focus-visible:ring-2 focus-visible:ring-[#720e32]/40 dark:bg-[#a52b50] dark:hover:bg-[#c13b64] dark:focus-visible:ring-[#ff9bb9]/40"
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
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 transition hover:border-[#720e32] focus-visible:ring-2 focus-visible:ring-[#720e32]/40 dark:border-white/10 dark:bg-[#281b24] dark:text-white dark:hover:border-[#ff9bb9] dark:focus-visible:ring-[#ff9bb9]/40"
          >
            {mounted &&
              (theme === "dark" ? <Sun size={19} /> : <Moon size={19} />)}
          </button>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#720e32] text-white transition hover:bg-[#570a26] focus-visible:ring-2 focus-visible:ring-[#720e32]/40 dark:bg-[#a52b50] dark:hover:bg-[#c13b64] dark:focus-visible:ring-[#ff9bb9]/40"
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenu && (
        <div className="animate-fade-in origin-top border-t border-gray-200 bg-[#fffaf7] px-5 py-5 dark:border-white/10 dark:bg-[#160e13] sm:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setMobileMenu(false)}
              className="rounded-lg py-2 font-semibold text-[#720e32] transition-colors focus-visible:ring-2 focus-visible:ring-[#720e32]/40 dark:text-[#ff9bb9] dark:focus-visible:ring-[#ff9bb9]/40"
            >
              Home
            </Link>

            <Link
              href="/services"
              onClick={() => setMobileMenu(false)}
              className="rounded-lg py-2 font-medium text-gray-700 transition-colors focus-visible:ring-2 focus-visible:ring-[#720e32]/40 dark:text-gray-200 dark:focus-visible:ring-[#ff9bb9]/40"
            >
              Browse Services
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileMenu(false)}
              className="rounded-lg py-2 font-medium text-gray-700 transition-colors focus-visible:ring-2 focus-visible:ring-[#720e32]/40 dark:text-gray-200 dark:focus-visible:ring-[#ff9bb9]/40"
            >
              About
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileMenu(false)}
              className="rounded-lg py-2 font-medium text-gray-700 transition-colors focus-visible:ring-2 focus-visible:ring-[#720e32]/40 dark:text-gray-200 dark:focus-visible:ring-[#ff9bb9]/40"
            >
              Contact
            </Link>

            <div className="flex gap-3 border-t border-gray-200 pt-4 dark:border-white/10">
              {user ? (
                <>
                  <ProfileDropDwoun />
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="rounded-xl border border-[#720e32]/40 bg-white px-5 py-2.5 text-base font-bold text-[#720e32] transition hover:bg-[#720e32] hover:text-white focus-visible:ring-2 focus-visible:ring-[#720e32]/40 dark:border-[#ff9bb9]/40 dark:bg-transparent dark:text-[#ffb0c5] dark:hover:bg-[#720e32] dark:focus-visible:ring-[#ff9bb9]/40"
                  >
                    Sign In
                  </Link>

                  {/* Sign Up */}
                  <Link
                    href="/sign-up"
                    className="rounded-xl bg-[#720e32] px-5 py-2.5 text-base font-bold text-white shadow-md transition hover:bg-[#570a26] focus-visible:ring-2 focus-visible:ring-[#720e32]/40 dark:bg-[#a52b50] dark:hover:bg-[#c13b64] dark:focus-visible:ring-[#ff9bb9]/40"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
