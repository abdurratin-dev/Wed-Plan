import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Crown, LayoutDashboard, LogOut, User } from "lucide-react";

export default function ProfileDropDwoun() {
  const { data: session, error } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    const { error } = await authClient.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      window.location.href = "/sign-in";
    }
  };
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            className={"h-fit w-fit"}
          >
            <div className="relative shrink-0">
              <Avatar className="h-9 w-9 border border-[#ead9dc] bg-white shadow-sm transition dark:border-white/10 dark:bg-[#281b24] sm:h-10 sm:w-10">
                <AvatarImage
                  src={user?.image || ""}
                  alt={user?.name || "User"}
                />
                <AvatarFallback className="bg-[#fce8ef] font-semibold text-[#8b2146] dark:bg-[#65122f]/40 dark:text-[#ff91b7]">
                  {user?.name?.slice(0, 1).toUpperCase() || "C"}
                </AvatarFallback>
              </Avatar>

              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-[#1d111a]" />
            </div>

            <div className="hidden min-w-0 flex-col items-start sm:flex">
              <span className="max-w-[130px] truncate text-sm font-semibold text-[#451127] dark:text-white">
                {user?.name || "User"}
              </span>

              <span className="text-xs capitalize text-gray-500 dark:text-gray-400">
                {user?.role || "Member"}
              </span>
            </div>

            <ChevronDown className="hidden h-4 w-4 shrink-0 text-gray-400 transition group-data-[state=open]:rotate-180 sm:block" />
          </Button>
        }
      />

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[calc(100vw-24px)] max-w-[320px] overflow-hidden rounded-2xl border border-[#f0dedc] bg-white p-2 shadow-xl shadow-[#720e32]/10 dark:border-white/10 dark:bg-[#1d111a] sm:w-[320px]"
      >
        {/* Profile Header */}
        <div className="rounded-xl bg-gradient-to-br from-[#fff5f7] to-[#fce8ef] p-4 dark:from-[#3a1728] dark:to-[#28111e]">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-12 w-12 shrink-0 border-2 border-white shadow-md dark:border-white/10">
              <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
              <AvatarFallback className="bg-[#fce8ef] font-bold text-[#8b2146] dark:bg-[#65122f] dark:text-[#ff91b7]">
                {user?.name?.slice(0, 1).toUpperCase() || "C"}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-bold text-[#451127] dark:text-white">
                {user?.name || "User"}
              </h2>

              <p className="mt-0.5 truncate text-xs text-[#8b6675] dark:text-[#c8aeba]">
                {user?.email || "user@example.com"}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="rounded-full border border-[#e8cbd4] bg-white/70 px-2.5 py-0.5 text-[10px] font-semibold capitalize text-[#81143c] dark:border-white/10 dark:bg-white/5 dark:text-[#ff91b7]">
                  {user?.role || "Member"}
                </span>

                {user?.premium && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:from-amber-500/20 dark:to-yellow-500/10 dark:text-amber-300">
                    <Crown className="h-3 w-3" />
                    Premium
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-2 space-y-1">
          <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Account Menu
          </p>

          <Link
            href={`/dashboard/${user?.role}`}
            className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#fff0f4] hover:text-[#720e32] dark:text-gray-200 dark:hover:bg-white/5 dark:hover:text-[#ff91b9]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fce8ef] text-[#8b2146] transition group-hover:bg-[#f5d5e1] dark:bg-[#65122f]/40 dark:text-[#ff91b7]">
              <LayoutDashboard className="h-[18px] w-[18px]" />
            </span>

            <span className="flex-1">Dashboard</span>

            <ArrowUpRight className="h-4 w-4 text-gray-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#81143c]" />
          </Link>

          <Link
            href="/profile"
            className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#fff0f4] hover:text-[#720e32] dark:text-gray-200 dark:hover:bg-white/5 dark:hover:text-[#ff91b9]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fce8ef] text-[#8b2146] transition group-hover:bg-[#f5d5e1] dark:bg-[#65122f]/40 dark:text-[#ff91b7]">
              <User className="h-[18px] w-[18px]" />
            </span>

            <span className="flex-1">My Profile</span>

            <ArrowUpRight className="h-4 w-4 text-gray-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#81143c]" />
          </Link>
        </div>

        {/* Logout */}
        <div className="mt-2 border-t border-[#f0e3e5] pt-2 dark:border-white/10">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 transition group-hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:group-hover:bg-red-500/20">
              <LogOut className="h-[18px] w-[18px]" />
            </span>

            <span>Logout</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
