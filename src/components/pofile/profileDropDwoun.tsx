import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Link from "next/link";
import { LayoutDashboard, LogOut, User } from "lucide-react";

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
  }
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button className={`w-12 h-12 rounded-full`} variant="ghost">
            <Avatar
              className={
                "w-12 h-12 border border-gray-200 bg-white text-gray-800 shadow-sm transition hover:border-[#720e32] dark:border-white/10 dark:bg-[#281b24] dark:text-white dark:hover:border-[#ff9bb9]"
              }
            >
              <AvatarImage
                src={user?.image || ""}
                alt="@shadcn"
                className="grayscale"
              />
              <AvatarFallback>
                {user?.name?.slice(0, 1).toUpperCase() || "C"}
              </AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <PopoverContent align="end" className="w-fit px-4">
        <div className="flex items-center gap-3">
          <Avatar
            className={
              "w-12 h-12 border border-gray-200 bg-white text-gray-800 shadow-sm transition hover:border-[#720e32] dark:border-white/10 dark:bg-[#281b24] dark:text-white dark:hover:border-[#ff9bb9]"
            }
          >
            <AvatarImage
              src={user?.image || ""}
              alt="@shadcn"
              className="grayscale"
            />
            <AvatarFallback>
              {user?.name?.slice(0, 1).toUpperCase() || "C"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-">{user?.name || "User"}</h2>
            <p className="text-sm text-muted-foreground">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>
        <hr className="my-2 border-t border-gray-200 dark:border-gray-700" />
        <ul>
          <li className="rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-[#720e32] dark:text-gray-200 dark:hover:bg-white/10 dark:hover:text-[#ff9bb9] flex items-center gap-2">
          <LayoutDashboard />
            <Link href={`/dashboard/${user?.role}`}>Dashboard</Link>
          </li>
          <li className="rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-[#720e32] dark:text-gray-200 dark:hover:bg-white/10 dark:hover:text-[#ff9bb9] flex items-center gap-2">
          <User />
            <Link href="/profile">Profile</Link>
          </li>
          <li className="rounded-lg px-4 py-3 text-sm text-gray-700 bg-red-500/10 hover:text-[#720e32] dark:text-gray-200 dark:hover:bg-red-500/10 dark:hover:text-[#ff9bb9] flex items-center gap-2">
          <LogOut />
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
