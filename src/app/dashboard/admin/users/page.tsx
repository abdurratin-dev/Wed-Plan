"use client";
import {
  Ban,
  ChevronDown,
  CircleCheckBig,
  Crown,
  Download,
  EllipsisVertical,
  Eye,
  House,
  Search,
  Shield,
  Store,
  User,
  UserX,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { getUsers } from "@/lib/actions/api/users";
import { IUsers } from "@/types/apidata";
import { useEffect, useState } from "react";
import AdminUsersCard from "@/components/admin/adminUsersCard";
import WedPlanSkeleton from "@/components/ui/skeleton/customer/CoustomarDashboardskeleton";
import { useRouter } from "next/navigation";

export type Status = "Active" | "Blocked";

const tableHeads = [
  "User",
  "User ID",
  "Role",
  "Joined Date",
  "Status",
  "Actions",
];

const selectClass =
  "h-10 appearance-none rounded-lg border border-[#e5e0e2] bg-white pr-9 pl-3 text-sm font-medium text-[#374151] outline-none focus:border-[#8e2249] focus:ring-2 focus:ring-[#8e2249]/20 dark:border-white/10 dark:bg-[#241820] dark:text-[#e8dfe3] dark:focus:border-[#ff9bb9]";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<IUsers[]>();
  const [cRole, setRole] = useState("All Roles");
  const [cStatus, setStatus] = useState("Active");
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState<IUsers[] | undefined>(users);
  const router = useRouter()
  useEffect(() => {
    const getData = async () => {
      try {
        const user = await getUsers();
        if(user.status){
          return router.push('/unauthorized')
        }
        const us : IUsers[] = !Array.isArray(user) ? [] : user
        if (!users) {
          setFilterUser(us);
        }
        setUsers(us);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);
  if (loading === true) {
    return <WedPlanSkeleton />;
  }
  const hendleRoleChang = (data: string) => {
    setRole(data);
    if (data === "All Roles") {
      setFilterUser(users);
    } else {
      const roleBaseUser = users?.filter((user) => user.role === data);
      setFilterUser(roleBaseUser);
    }
  };

  const hendleStatusChang = (data: string) => {
    setStatus(data);
    if (data === "All Status") {
      setFilterUser(users);
    } else {
      const statusBaseUser = users?.filter((user) => user.status === data);
      setFilterUser(statusBaseUser);
    }
  };
  const vendors = users?.filter((user) => user.role === "vendor");
  const customers = users?.filter((user) => user.role === "vendor");
  const blokedUsers = users?.filter((user) => user.status === "Blocked");
  const stats = [
    {
      label: "Total Users",
      value: users?.length,
      up: true,
      card: "bg-[#fbe7ee] dark:bg-[#8e2249]/20",
      icon: "bg-[#8e2249]",
      Icon: Users,
    },
    {
      label: "Customers",
      value: customers?.length,
      up: true,
      card: "bg-[#e7f8ee] dark:bg-[#16a34a]/20",
      icon: "bg-[#16a34a]",
      Icon: CircleCheckBig,
    },
    {
      label: "Vendors",
      value: vendors?.length,
      up: true,
      card: "bg-[#e6f1fd] dark:bg-[#2563eb]/20",
      icon: "bg-[#2563eb]",
      Icon: Shield,
    },
    {
      label: "Blocked Users",
      value: blokedUsers?.length,
      up: false,
      card: "bg-[#fdeaea] dark:bg-[#dc2626]/20",
      icon: "bg-[#dc2626]",
      Icon: UserX,
    },
  ];
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fdfbfa] px-4 py-8 sm:px-6 lg:px-10 dark:bg-[#160e13]">
      <div className="mx-auto w-full max-w-7xl">
        {/* ---------- Page header ---------- */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl dark:text-[#ffeaf1]">
              All Users
            </h1>
            <p className="mt-2 text-sm text-[#6b7280] dark:text-[#b3a3ab] sm:text-[0.95rem] dark:text-[#c8b3bd]">
              Manage and monitor all registered platform users.
            </p>
          </div>

          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="inline-flex w-fit items-center gap-2 self-start rounded-full bg-white px-4 py-2 text-sm font-medium text-[#4b5563] shadow-sm ring-1 ring-[#ece6e9] dark:bg-white/5 dark:text-[#d6cbd1] dark:ring-white/10"
          >
            <House className="size-4 text-[#8e2249] dark:text-[#ff9bb9]" />
            <span>Admin</span>
            <span className="text-[#9ca3af] dark:text-[#9b8792]" aria-hidden="true">
              ›
            </span>
            <span className="text-[#111827] dark:text-[#ffeaf1]">Users</span>
          </nav>
        </div>

        {/* ---------- Stat cards ---------- */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.Icon;
            return (
              <div
                key={s.label}
                className={`flex items-center gap-4 rounded-2xl p-5 ${s.card}`}
              >
                <span
                  className={`flex size-12 shrink-0 items-center justify-center rounded-full text-white ${s.icon}`}
                >
                  <Icon className="size-6" />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-[#4b5563] dark:text-[#c8b3bd]">
                    {s.label}
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold tracking-tight text-[#111827] dark:text-[#ffeaf1]">
                      {s.value}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ---------- User directory ---------- */}
        <section className="mt-6 rounded-2xl border border-[#efe8eb] bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-[#1f1419]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#111827] dark:text-[#ffeaf1]">
                User Directory
              </h2>
              <p className="mt-1 text-sm text-[#6b7280] dark:text-[#b3a3ab] dark:text-[#c8b3bd]">
                View and manage all platform accounts.
              </p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9ca3af] dark:text-[#9b8792]" />
                <Input
                  type="search"
                  placeholder="Search by name or email..."
                  className="h-10 w-full rounded-lg border-[#e5e0e2] bg-white pr-4 pl-9 text-sm shadow-none placeholder:text-[#9ca3af] dark:text-[#9b8792] focus-visible:border-[#8e2249] focus-visible:ring-[#8e2249]/20 dark:border-white/10 dark:bg-white/5 dark:focus-visible:border-[#ff9bb9]"
                />
              </div>

              <div className="relative">
                <select
                  aria-label="Filter by role"
                  className={selectClass}
                  value={cRole}
                  onChange={(e) => hendleRoleChang(e.target.value)}
                >
                  <option value="All Roles">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="vendor">Vendor</option>
                  <option value="customer">Customer</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#6b7280] dark:text-[#b3a3ab]" />
              </div>

              <div className="relative">
                <select
                  aria-label="Filter by status"
                  className={selectClass}
                  value={cStatus}
                  onChange={(e) => hendleStatusChang(e.target.value)}
                >
                  <option value="All Status">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Blocked">Blocked</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#6b7280] dark:text-[#b3a3ab]" />
              </div>
            </div>
          </div>

          {/* ---------- Table ---------- */}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse text-left">
              <thead>
                <tr>
                  {tableHeads.map((head, i) => (
                    <th
                      key={head}
                      className={`bg-[#faf8f9] px-4 py-3.5 text-sm font-semibold text-[#6b7280] dark:text-[#b3a3ab] dark:bg-white/5 dark:text-[#a998a1] ${
                        i === 0 ? "rounded-l-lg" : ""
                      } ${i === tableHeads.length - 1 ? "rounded-r-lg" : ""}`}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filterUser?.map((u) => {
                  return <AdminUsersCard key={u._id} u={u} />;
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
