
function SubscriptionSkeleton() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff8f6] px-4 py-16 dark:bg-[#160e13]">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-24 -top-20 h-72 w-72 rounded-full bg-[#f8dadd]/50 blur-3xl dark:bg-[#a52b50]/15" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#f8dadd]/50 blur-3xl dark:bg-[#a52b50]/15" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header Skeleton */}
        <div className="mb-14 text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-[#dba2a9] dark:bg-white/15" />
            <div className="h-7 w-7 animate-pulse rounded-full bg-[#e8c6ca] dark:bg-white/15" />
            <div className="h-px w-16 bg-[#dba2a9] dark:bg-white/15" />
          </div>

          <div className="mx-auto mb-4 h-3 w-40 animate-pulse rounded-full bg-[#ead5d5] dark:bg-[#2f1e28]" />

          <div className="mx-auto h-12 w-72 animate-pulse rounded-lg bg-[#ead5d5] dark:bg-[#2f1e28] sm:h-14 sm:w-96" />

          <div className="mx-auto mt-5 max-w-2xl space-y-2">
            <div className="mx-auto h-3 w-full max-w-lg animate-pulse rounded-full bg-[#eadfdf] dark:bg-white/10" />
            <div className="mx-auto h-3 w-3/4 max-w-md animate-pulse rounded-full bg-[#eadfdf] dark:bg-white/10" />
          </div>
        </div>

        {/* Pricing Cards Skeleton */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-8 md:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className={`relative rounded-3xl border border-[#f0d5d2] bg-white p-7 shadow-xl sm:p-9 dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none ${
                item === 2 ? "md:scale-105" : ""
              }`}
            >
              {/* Badge */}
              <div className="mb-6 h-7 w-28 animate-pulse rounded-full bg-[#f5e3e2] dark:bg-white/10" />

              {/* Plan Name */}
              <div className="mb-3 h-7 w-40 animate-pulse rounded-lg bg-[#ead5d5] dark:bg-[#2f1e28]" />

              {/* Description */}
              <div className="mb-7 space-y-2">
                <div className="h-3 w-full animate-pulse rounded-full bg-[#f0e6e5] dark:bg-white/10" />
                <div className="h-3 w-3/4 animate-pulse rounded-full bg-[#f0e6e5] dark:bg-white/10" />
              </div>

              {/* Price */}
              <div className="mb-8 flex items-end gap-2">
                <div className="h-12 w-32 animate-pulse rounded-lg bg-[#ead5d5] dark:bg-[#2f1e28]" />
                <div className="mb-2 h-4 w-20 animate-pulse rounded bg-[#f0e6e5] dark:bg-white/10" />
              </div>

              {/* Button */}
              <div className="mb-8 h-12 w-full animate-pulse rounded-xl bg-[#ead5d5] dark:bg-[#2f1e28]" />

              {/* Divider */}
              <div className="mb-6 h-px w-full bg-[#f0e6e5] dark:bg-white/10" />

              {/* Features Heading */}
              <div className="mb-5 h-4 w-36 animate-pulse rounded bg-[#ead5d5] dark:bg-[#2f1e28]" />

              {/* Features List */}
              <div className="space-y-5">
                {[1, 2, 3, 4, 5].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <div className="h-5 w-5 shrink-0 animate-pulse rounded-full bg-[#f0d5d2] dark:bg-[#a52b50]/30" />
                    <div
                      className={`h-3 animate-pulse rounded-full bg-[#f0e6e5] dark:bg-white/10 ${
                        feature % 2 === 0 ? "w-2/3" : "w-4/5"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note Skeleton */}
        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-3 rounded-full border border-[#f0d5d2] bg-white/70 px-5 py-3 shadow-sm dark:border-white/10 dark:bg-[#1e131a]/70 dark:shadow-none">
            <div className="h-4 w-4 animate-pulse rounded-full bg-[#e8c6ca] dark:bg-white/15" />
            <div className="h-3 w-56 animate-pulse rounded-full bg-[#eadfdf] dark:bg-white/10" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default SubscriptionSkeleton;
