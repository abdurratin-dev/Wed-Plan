import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Crown, Store, User, Users } from "lucide-react";
import { IUsers } from "@/types/apidata";
import { updateUsers } from "@/lib/actions/api/users";
import { useState } from "react";
import ManegUserDropdwoun from "./manegUserDropdwoun";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export type Role = "admin" | "vendor" | "customer";

interface IRoleBadges {
  admin: {
    className: string;
    Icon: typeof Users;
  };
  vendor: {
    className: string;
    Icon: typeof Users;
  };
  customer: {
    className: string;
    Icon: typeof Users;
  };
}

type RoleKey = keyof IRoleBadges;

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const roleBadges: IRoleBadges = {
  admin: {
    className:
      "bg-[#fce7f3] text-[#be185d] dark:bg-[#fce7f3]/10 dark:text-[#ff9bb9]",
    Icon: Crown,
  },
  vendor: {
    className:
      "bg-[#dbeafe] text-[#1d4ed8] dark:bg-[#dbeafe]/10 dark:text-[#93c5fd]",
    Icon: Store,
  },
  customer: {
    className:
      "bg-[#f3f4f6] text-[#4b5563] dark:bg-white/10 dark:text-[#d6cbd1]",
    Icon: User,
  },
};

export default function AdminUsersCard({ u }: { u: IUsers }) {
  const [updateStatus, setStatus] = useState(u.status);
  const [viewOpen, setViewOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const role = roleBadges[u.role as RoleKey];
  const RoleIcon = role.Icon;

  const handleStatusChange = async (data: string) => {
    const res = await updateUsers({ id: u._id, status: data });
    if (res.modifiedCount > 0) {
      setStatus(data);
    }
  };
  return (
    <tr className="border-b border-[#f1ecef] last:border-0 dark:border-white/10">
      {/* User */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar
            size="lg"
            className="ring-1 ring-[#f1ecef] dark:ring-white/10"
          >
            <AvatarImage src={u.image} alt={u.name} />
            <AvatarFallback className="bg-[#fce7f3] text-xs font-bold text-[#8e2249] dark:bg-[#fce7f3]/10 dark:text-[#ff9bb9]">
              {initials(u.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#1f2937] dark:text-[#ffeaf1]">
              {u.name}
            </p>
            <p className="truncate text-xs text-[#9ca3af] dark:text-[#9b8792]">
              {u.email}
            </p>
          </div>
        </div>
      </td>

      {/* User ID */}
      <td className="px-4 py-4 text-sm font-medium text-[#4b5563] dark:text-[#c8b3bd]">
        {u._id}
      </td>

      {/* Role */}
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${role.className}`}
        >
          <RoleIcon className="size-3.5" />
          {u.role}
        </span>
      </td>

      {/* Joined date */}
      <td className="px-4 py-4 text-sm font-medium text-[#8e2249] dark:text-[#ff9bb9]">
        {u.createdAt.slice(0, 10)}
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center gap-2 text-sm font-semibold ${updateStatus === "Active" ? "text-[#15803d] dark:text-[#4ade80]" : "text-[#dc2626] dark:text-[#f87171]"}`}
        >
          <span
            className={`size-2 rounded-full ${updateStatus === "Active" ? "bg-[#16a34a]" : "bg-[#dc2626]"}`}
          />
          {updateStatus}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          <ManegUserDropdwoun
            userName={u.name}
            status={updateStatus}
            open={menuOpen}
            onOpenChange={setMenuOpen}
            onView={() => {
              setMenuOpen(false);
              setViewOpen(true);
            }}
            onBlock={() => {
              setMenuOpen(false);
              void handleStatusChange(
                updateStatus === "Active" ? "Blocked" : "Active",
              );
            }}
            u={u}
          />
        </div>
      </td>
    </tr>
  );
}
