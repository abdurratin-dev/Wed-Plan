
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-lg bg-[#f0e5e3] dark:bg-white/[0.08] ${className}`}
  />
);

const BrowseServicesSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#fdfbfa] pb-20 dark:bg-[#160e13]">

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-[#f1e5e1] dark:border-white/10">
        <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">

          {/* Breadcrumb */}
          <div className="mb-7 flex items-center gap-3">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-28" />
          </div>

          {/* Heading */}
          <Skeleton className="h-10 w-64 sm:w-80" />

          <div className="mt-4 space-y-2">
            <Skeleton className="h-3 w-full max-w-md" />
            <Skeleton className="h-3 w-64" />
          </div>

          {/* Search */}
          <div className="mt-7 flex max-w-xl items-center gap-3">
            <Skeleton className="h-12 flex-1 rounded-full" />
            <Skeleton className="h-12 w-24 rounded-full" />
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1500px] px-4 pt-7 sm:px-6 lg:px-10">

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-7">

          {/* Filter Sidebar */}
          <aside className="w-full shrink-0 lg:w-[276px]">

            <div className="rounded-2xl border border-[#f1ded7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1e131a]">

              {/* Filter Header */}
              <div className="flex items-center justify-between border-b border-[#f6ece8] pb-4 dark:border-white/10">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>

              {/* Categories */}
              <div className="border-b border-[#f6ece8] py-5 dark:border-white/10">
                <Skeleton className="mb-5 h-4 w-24" />

                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Skeleton className="size-4 rounded" />
                      <Skeleton
                        className="h-3"
                       
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="border-b border-[#f6ece8] py-5 dark:border-white/10">
                <Skeleton className="mb-3 h-4 w-20" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>

              {/* Price Range */}
              <div className="py-5">
                <Skeleton className="mb-3 h-4 w-24" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>

              {/* Apply Button */}
              <Skeleton className="h-12 w-full rounded-xl" />

            </div>
          </aside>

          {/* Services Results */}
          <section className="min-w-0 flex-1">

            {/* Toolbar */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <Skeleton className="h-4 w-40" />

              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-10 w-36 rounded-xl" />
              </div>

            </div>

            {/* Service Cards Grid */}
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-[#f1ded7] bg-white shadow-[0_10px_30px_-25px_rgba(114,14,50,0.4)] dark:border-white/10 dark:bg-[#1e131a]"
                >

                  {/* Image */}
                  <div className="relative">
                    <Skeleton className="h-48 w-full rounded-none sm:h-44" />

                    {/* Favorite Icon */}
                    <div className="absolute top-3 right-3">
                      <Skeleton className="size-9 rounded-full bg-white/70 dark:bg-[#38232e]" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="space-y-3 p-4">

                    {/* Title */}
                    <Skeleton className="h-4 w-3/4" />

                    {/* Category */}
                    <Skeleton className="h-3 w-1/2" />

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-16" />
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between border-t border-[#f6ece8] pt-3 dark:border-white/10">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-7 w-16 rounded-lg" />
                    </div>

                  </div>
                </div>
              ))}

            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default BrowseServicesSkeleton;
