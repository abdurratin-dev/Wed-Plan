import {cn} from '@/lib/utils'
const Skeleton = ({ className = "" }) => (
  <div
    className={cn(
      "animate-pulse rounded-lg bg-[#f1e5e2] dark:bg-white/10",
      className,
    )}
  />
);

export default function ServiceDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-[#fdfbfa] pb-20 dark:bg-[#160e13]">
      <div className="mx-auto w-full max-w-[1500px] px-4 pt-7 sm:px-6 lg:px-10">

        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-2" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-2" />
          <Skeleton className="h-3 w-32" />
        </div>

        {/* Main Content */}
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">

          {/* Left Column */}
          <div className="min-w-0 space-y-6">

            {/* Gallery + Summary */}
            <section className="rounded-2xl border border-[#f1ded7] bg-white p-4 shadow-[0_24px_50px_-40px_rgba(114,14,50,0.6)] dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none">
              <div className="grid gap-5 sm:grid-cols-2">

                {/* Image */}
                <Skeleton className="aspect-[4/3] w-full rounded-xl" />

                {/* Summary */}
                <div className="flex flex-col">
                  <Skeleton className="h-6 w-24 rounded-full" />

                  <Skeleton className="mt-4 h-8 w-3/4" />

                  <Skeleton className="mt-3 h-4 w-32" />

                  <div className="mt-4 flex gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>

                  <Skeleton className="mt-4 h-4 w-40" />

                  <Skeleton className="mt-4 h-9 w-36" />

                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3.5 w-4/5" />
                  </div>

                  {/* Highlights */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Skeleton className="h-7 w-24 rounded-full" />
                    <Skeleton className="h-7 w-28 rounded-full" />
                    <Skeleton className="h-7 w-24 rounded-full" />
                  </div>
                </div>
              </div>
            </section>

            {/* Tabs */}
            <section className="rounded-2xl border border-[#f1ded7] bg-white p-5 shadow-[0_24px_50px_-40px_rgba(114,14,50,0.6)] dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none">

              {/* Tab Buttons */}
              <div className="flex flex-wrap gap-2 border-b border-[#f6ece8] pb-4 dark:border-white/10">
                <Skeleton className="h-9 w-24 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-full" />
                <Skeleton className="h-9 w-28 rounded-full" />
              </div>

              {/* Tab Content */}
              <div className="pt-5 space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-3/4" />
              </div>
            </section>
          </div>

          {/* Right Column */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">

            {/* Booking Card */}
            <section className="rounded-2xl border border-[#f1ded7] bg-white p-5 shadow-[0_24px_50px_-40px_rgba(114,14,50,0.6)] dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none">

              <div className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="h-5 w-36" />
              </div>

              <Skeleton className="mt-3 h-3 w-52" />

              {/* Booking Inputs */}
              <div className="mt-5 space-y-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <Skeleton className="h-px flex-1" />
                  <Skeleton className="h-3 w-5" />
                  <Skeleton className="h-px flex-1" />
                </div>

                <Skeleton className="h-12 w-full rounded-xl" />
              </div>

              {/* Security */}
              <Skeleton className="mt-5 h-10 w-full rounded-xl" />
            </section>

            {/* Promo Banner */}
            <section className="rounded-2xl border border-[#f1ded7] bg-white p-6 dark:border-white/10 dark:bg-[#1e131a]">
              <Skeleton className="mx-auto size-8 rounded-full" />
              <Skeleton className="mx-auto mt-4 h-7 w-4/5" />
              <Skeleton className="mx-auto mt-3 h-3 w-3/4" />
              <Skeleton className="mx-auto mt-5 h-10 w-36 rounded-full" />
            </section>
          </aside>
        </div>

        {/* Related Services */}
        <section className="mt-10">

          {/* Heading */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-px flex-1" />
            <Skeleton className="h-7 w-44" />
            <Skeleton className="h-px flex-1" />
          </div>

          {/* Service Cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-[#f1ded7] bg-white p-3 dark:border-white/10 dark:bg-[#1e131a]"
              >
                <Skeleton className="aspect-[4/3] w-full rounded-xl" />

                <div className="space-y-3 p-2 pt-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3.5 w-1/2" />
                  <Skeleton className="h-3.5 w-full" />

                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-9 w-20 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}