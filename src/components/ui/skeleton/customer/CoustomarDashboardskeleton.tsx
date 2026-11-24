
"use client";

const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse rounded-lg bg-[#f0e5e3] dark:bg-white/[0.08] ${className}`}
  />
);

// Reusable service card
const ServiceCardSkeleton = () => (
  <div className="overflow-hidden rounded-xl border border-[#f1ded7] bg-white dark:border-white/10 dark:bg-[#21151c]">
    <Skeleton className="h-40 w-full rounded-none" />
    <div className="space-y-3 p-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

// Reusable Navbar
const NavbarSkeleton = () => (
  <header className="border-b border-[#f1e5e1] bg-white dark:border-white/10 dark:bg-[#21151c]">
    <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 lg:px-10">
      <Skeleton className="h-8 w-32" />

      <div className="hidden items-center gap-8 md:flex">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-16" />
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
      </div>
    </div>
  </header>
);

// Reusable Section Heading
const SectionHeadingSkeleton = () => (
  <div className="mb-6 space-y-3 text-center">
    <Skeleton className="mx-auto h-3 w-28" />
    <Skeleton className="mx-auto h-7 w-64 max-w-full" />
  </div>
);

// 1. HOME PAGE
const HomeSkeleton = () => (
  <>
    <NavbarSkeleton />

    {/* Hero */}
    <section className="bg-[#f9eeea] dark:bg-[#281721]">
      <div className="mx-auto grid max-w-[1500px] items-center gap-8 px-5 py-12 lg:grid-cols-2 lg:px-10 lg:py-16">
        <div className="space-y-5">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-10 w-full max-w-lg sm:h-14" />
          <Skeleton className="h-10 w-4/5 max-w-md sm:h-14" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-full max-w-sm" />
            <Skeleton className="h-4 w-3/4 max-w-sm" />
          </div>

          <div className="flex max-w-md gap-2">
            <Skeleton className="h-12 flex-1 rounded-full" />
            <Skeleton className="h-12 w-24 rounded-full" />
          </div>

          <Skeleton className="h-5 w-44" />
        </div>

        <Skeleton className="h-[300px] w-full rounded-2xl lg:h-[400px]" />
      </div>
    </section>

    {/* Featured Services */}
    <section className="mx-auto max-w-[1500px] px-5 py-10 lg:px-10">
      <SectionHeadingSkeleton />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    </section>

    {/* Categories */}
    <section className="mx-auto max-w-[1500px] px-5 py-8 lg:px-10">
      <Skeleton className="mb-6 h-7 w-56" />

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-3 rounded-xl bg-[#fcf2ef] p-5 dark:bg-white/[0.04]"
          >
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="h-3 w-20 max-w-full" />
          </div>
        ))}
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="mx-auto max-w-[1500px] px-5 py-10 lg:px-10">
      <SectionHeadingSkeleton />

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <Skeleton className="size-12 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-36 max-w-full" />
          </div>
        ))}
      </div>
    </section>

    {/* How it works */}
    <section className="mx-auto max-w-[1500px] px-5 py-10 lg:px-10">
      <SectionHeadingSkeleton />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-[#650d2d] px-6 py-10">
      <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-8 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-6 w-28 bg-white/15" />
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton key={j} className="h-3 w-24 bg-white/10" />
            ))}
          </div>
        ))}
      </div>
    </footer>
  </>
);

// 2. BROWSE SERVICES PAGE
const BrowseServicesSkeleton = () => (
  <>
    <NavbarSkeleton />

    {/* Hero Banner */}
    <div className="bg-[#f5e6df] dark:bg-[#281721]">
      <div className="mx-auto max-w-[1500px] px-5 py-10 lg:px-10">
        <Skeleton className="mb-4 h-9 w-64" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
    </div>

    <main className="mx-auto max-w-[1500px] px-5 py-8 lg:px-10">
      <div className="flex flex-col gap-6 lg:flex-row">

        {/* Filter Sidebar */}
        <aside className="w-full shrink-0 lg:w-[260px]">
          <div className="rounded-2xl border border-[#f1ded7] bg-white p-5 dark:border-white/10 dark:bg-[#21151c]">
            <Skeleton className="mb-6 h-5 w-28" />

            <div className="space-y-5">
              <div className="space-y-4">
                <Skeleton className="h-4 w-24" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="size-4 rounded" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>

              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>

              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          </div>
        </aside>

        {/* Results */}
        <section className="min-w-0 flex-1">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row">
            <Skeleton className="h-11 w-full max-w-sm rounded-xl" />
            <Skeleton className="h-10 w-36 rounded-lg" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    </main>
  </>
);

// 3. VENDOR DASHBOARD
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-[#fdf9f7] dark:bg-[#160e13]">
    <div className="flex min-h-screen">

      {/* Dashboard Content */}
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-3 w-64 max-w-full" />
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="size-10 rounded-full" />
          </div>
        </div>

        {/* Welcome */}
        <div className="mb-7 space-y-3">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-3 w-72 max-w-full" />
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#f1ded7] bg-white p-5 dark:border-white/10 dark:bg-[#21151c]"
            >
              <Skeleton className="mb-4 size-10 rounded-xl" />
              <Skeleton className="mb-3 h-8 w-16" />
              <Skeleton className="h-3 w-28" />
            </div>
          ))}
        </div>

        {/* Charts and Recent Requests */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* Chart */}
          <div className="rounded-xl border border-[#f1ded7] bg-white p-5 dark:border-white/10 dark:bg-[#21151c] xl:col-span-2">
            <div className="mb-6 flex justify-between">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-8 w-28 rounded-lg" />
            </div>

            <div className="flex h-64 items-end gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="flex-1 rounded-t-md rounded-b-none"
                />
              ))}
            </div>
          </div>

          {/* Recent Requests */}
          <div className="rounded-xl border border-[#f1ded7] bg-white p-5 dark:border-white/10 dark:bg-[#21151c]">
            <Skeleton className="mb-6 h-5 w-36" />

            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-10 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Table */}
        <div className="mt-6 rounded-xl border border-[#f1ded7] bg-white p-5 dark:border-white/10 dark:bg-[#21151c]">
          <Skeleton className="mb-6 h-5 w-40" />

          <div className="space-y-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-7 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  </div>
);

// 4. AUTH PAGE (Sign In / Sign Up)
const AuthSkeleton = ({ type = "signin" }) => {
  const isSignup = type === "signup";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff8f5] p-4 dark:bg-[#160e13]">

      <div className="grid w-full max-w-[1050px] overflow-hidden rounded-3xl border border-[#f0ded8] bg-white shadow-xl dark:border-white/10 dark:bg-[#21151c] md:grid-cols-2">

        {/* Wedding Image Placeholder */}
        <div className="hidden min-h-[600px] md:block">
          <Skeleton className="h-full w-full rounded-none" />
        </div>

        {/* Form */}
        <div className="flex flex-col justify-center p-6 sm:p-10">

          <div className="mb-10 text-center">
            <Skeleton className="mx-auto mb-8 h-9 w-32" />
            <Skeleton className="mx-auto mb-3 h-7 w-52" />
            <Skeleton className="mx-auto h-3 w-44" />
          </div>

          {isSignup && (
            <div className="mb-5 flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 flex-1 rounded-lg" />
              ))}
            </div>
          )}

          {/* Google Login */}
          {!isSignup && (
            <>
              <Skeleton className="mb-5 h-11 w-full rounded-lg" />
              <Skeleton className="mx-auto mb-5 h-3 w-8" />
            </>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            {Array.from({
              length: isSignup ? 3 : 2,
            }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
            ))}
          </div>

          {!isSignup && (
            <Skeleton className="mt-3 ml-auto h-3 w-28" />
          )}

          <Skeleton className="mt-6 h-12 w-full rounded-lg" />

          <Skeleton className="mx-auto mt-7 h-3 w-48" />
        </div>
      </div>
    </div>
  );
};

// MAIN COMPONENT
const WedPlanSkeleton = ({ page = "home" }) => {
  switch (page) {
    case "dashboard":
      return <DashboardSkeleton />;

    default:
      return <DashboardSkeleton />;
  }
};

export default WedPlanSkeleton;
