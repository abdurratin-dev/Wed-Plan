
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Ban,
  Crown,
  Eye,
  ShieldCheck,
  Store,
  User,
  Users,
} from "lucide-react";
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

const detailRowClass =
  "flex items-center justify-between gap-3 text-[#6b7280] dark:text-[#c8b3bd]";
const detailLabelClass = "font-medium text-[#9ca3af] dark:text-[#9b8792]";
const detailValueClass =
  "truncate font-semibold text-[#1f2937] dark:text-[#ffeaf1]";
export default function AdminUsersCard({ u }: { u: IUsers }) {
  const [updateStatus, setStatus] = useState(u.status);
  const [viewOpen,setViewOpen] = useState(false)
  const role = roleBadges[u.role as RoleKey];
  const RoleIcon = role.Icon;

  const handleBanButton = async (data: string) => {
    const res = await updateUsers({ id: u._id, status: data });
    if (res.modifiedCount > 0) {
      setStatus(data);
    }
  };

  const handleUnbanButton = async (data: string) => {
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
            <AvatarFallback className="bg-[#fce7f3] text-xs font-bold text-[#8e2249]">
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
          <Popover open={viewOpen} onOpenChange={setViewOpen}>
            <PopoverTrigger
              render={
                <button
                  type="button"
                  aria-label={`View details for ${u.name}`}
                  className="rounded-lg p-2.5 text-[#6b7280] transition-colors hover:bg-[#f3f1f2] hover:text-[#8e2249] focus-visible:ring-2 focus-visible:ring-[#720e32]/30 focus-visible:outline-none dark:text-[#c8b3bd] dark:hover:bg-white/10 dark:hover:text-[#ff9bb9] dark:focus-visible:ring-[#ff9bb9]/30"
                >
                  <Eye className="size-4" />
                </button>
              }
            />
            <PopoverContent align="end" className="w-64 gap-3 p-3.5">
              <div className="border-b border-[#f1ecef] pb-2 dark:border-white/10">
                <p className="truncate text-sm font-bold text-[#1f2937] dark:text-[#ffeaf1]">
                  {u.name}
                </p>
                <p className="mt-0.5 text-xs text-[#9ca3af] dark:text-[#9b8792]">
                  {u.email}
                </p>
              </div>
              <dl className="flex flex-col gap-1.5 text-xs">
                <div className={detailRowClass}>
                  <dt className={detailLabelClass}>Role</dt>
                  <dd className={detailValueClass}>{u.role}</dd>
                </div>
                <div className={detailRowClass}>
                  <dt className={detailLabelClass}>Premium user</dt>
                  <dd className={detailValueClass}>{u.premium ? "Premium" : "Non Premium"}</dd>
                </div>
                <div className={detailRowClass}>
                  <dt className={detailLabelClass}>Status</dt>
                  <dd>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold ${
                        u.status === "Active"
                          ? "bg-[#16a34a]/15 text-[#15803d] dark:bg-[#16a34a]/20 dark:text-[#4ade80]"
                          : "bg-[#dc2626]/15 text-[#dc2626] dark:bg-[#dc2626]/20 dark:text-[#f87171]"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          u.status === "Active"
                            ? "bg-[#16a34a] dark:bg-[#4ade80]"
                            : "bg-[#dc2626] dark:bg-[#f87171]"
                        }`}
                      />
                      {u.status}
                    </span>
                  </dd>
                </div>
              </dl>
            </PopoverContent>
          </Popover>
          {updateStatus === "Active" ? (
            <button
              type="button"
              aria-label={`Block ${u.name}`}
              className="rounded-lg p-2.5 text-[#dc2626] transition-colors hover:bg-[#fdecec] focus-visible:ring-2 focus-visible:ring-[#dc2626]/30 focus-visible:outline-none dark:hover:bg-[#dc2626]/10 dark:focus-visible:ring-[#f87171]/30"
              onClick={() => handleBanButton("Blocked")}
            >
              <Ban className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              aria-label={`Block ${u.name}`}
              className="rounded-lg p-2.5 text-[#16a34a] transition-colors hover:bg-[#f3fdec] focus-visible:ring-2 focus-visible:ring-[#16a34a]/30 focus-visible:outline-none dark:hover:bg-[#26dc3b]/10 dark:focus-visible:ring-[#4ade80]/30"
              onClick={() => handleUnbanButton("Active")}
            >
              <ShieldCheck className="size-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
