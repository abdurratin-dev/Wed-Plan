
const ProfileSkeleton = () => {
  return (
    <main className="min-h-screen bg-[#fff9f6] px-4 py-6 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-[#110a0e]">
      <div className="mx-auto max-w-6xl">

        {/* Page Heading */}
        <div className="mb-6">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-[#ead5d5] dark:bg-white/10" />
          <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-[#f0e5e3] dark:bg-white/5" />
        </div>

        {/* Profile Cover */}
        <section className="overflow-hidden rounded-2xl border border-[#f0dedc] bg-white shadow-sm dark:border-white/10 dark:bg-[#1d111a]">

          {/* Cover Banner */}
          <div className="relative h-44 overflow-hidden bg-gradient-to-r from-[#500d28] via-[#81143c] to-[#bd4774] sm:h-56">
            <div className="absolute left-6 top-6 flex items-center gap-2">
              <div className="h-5 w-5 animate-pulse rounded-full bg-white/20" />
              <div className="h-4 w-20 animate-pulse rounded bg-white/20" />
            </div>

            <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
            <div className="absolute -bottom-32 right-1/3 h-64 w-64 rounded-full border-[35px] border-white/5" />
          </div>

          {/* Profile Information */}
          <div className="relative px-5 pb-6 sm:px-8">
            <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

                {/* Avatar */}
                <div className="h-28 w-28 shrink-0 animate-pulse rounded-2xl border-4 border-white bg-[#ead5d5] dark:border-[#1d111a] dark:bg-[#38202e] sm:h-32 sm:w-32" />

                {/* User Details */}
                <div className="space-y-3 pb-1">
                  <div className="h-6 w-40 animate-pulse rounded bg-[#ead5d5] dark:bg-white/10" />

                  <div className="h-4 w-52 animate-pulse rounded bg-[#f0e5e3] dark:bg-white/5" />

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="h-6 w-20 animate-pulse rounded-full bg-[#f5dce5] dark:bg-[#65122f]/40" />
                    <div className="h-6 w-20 animate-pulse rounded-full bg-[#f5e9c7] dark:bg-[#6c5911]/40" />
                    <div className="h-3 w-16 animate-pulse rounded bg-[#e5e5e5] dark:bg-white/10" />
                  </div>
                </div>
              </div>

              {/* Joined Date */}
              <div className="h-4 w-44 animate-pulse rounded bg-[#f0e5e3] dark:bg-white/5 sm:mb-2" />
            </div>
          </div>
        </section>

        {/* Booking Statistics */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 rounded-2xl border border-[#f0dedc] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1d111a]"
            >
              <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-[#f0dce2] dark:bg-white/10" />

              <div className="space-y-2">
                <div className="h-3 w-28 animate-pulse rounded bg-[#f0e5e3] dark:bg-white/10" />
                <div className="h-7 w-16 animate-pulse rounded bg-[#ead5d5] dark:bg-white/10" />
              </div>
            </div>
          ))}
        </section>

        {/* Main Profile Content */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Personal Information */}
          <section className="rounded-2xl border border-[#f0dedc] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1d111a] sm:p-6 lg:col-span-2">

            {/* Section Heading */}
            <div className="mb-6 space-y-2">
              <div className="h-6 w-48 animate-pulse rounded bg-[#ead5d5] dark:bg-white/10" />
              <div className="h-3 w-44 animate-pulse rounded bg-[#f0e5e3] dark:bg-white/5" />
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {[1, 2].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-[#f0dce2] dark:bg-white/10" />

                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 animate-pulse rounded bg-[#f0e5e3] dark:bg-white/5" />
                    <div className="h-4 w-40 max-w-full animate-pulse rounded bg-[#ead5d5] dark:bg-white/10" />
                  </div>
                </div>
              ))}
            </div>

            {/* About Me */}
            <div className="mt-8 border-t border-[#f2e5e5] pt-6 dark:border-white/10">
              <div className="mb-4 h-4 w-24 animate-pulse rounded bg-[#ead5d5] dark:bg-white/10" />

              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-[#f0e5e3] dark:bg-white/5" />
                <div className="h-3 w-full animate-pulse rounded bg-[#f0e5e3] dark:bg-white/5" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-[#f0e5e3] dark:bg-white/5" />
              </div>
            </div>
          </section>

          {/* Account Settings */}
          <section className="flex flex-col rounded-2xl border border-[#f0dedc] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1d111a] sm:p-6">

            {/* Section Heading */}
            <div className="mb-5 space-y-2">
              <div className="h-6 w-40 animate-pulse rounded bg-[#ead5d5] dark:bg-white/10" />
              <div className="h-3 w-48 animate-pulse rounded bg-[#f0e5e3] dark:bg-white/5" />
            </div>

            {/* Edit Profile */}
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-[#f1e3e3] p-3 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 animate-pulse rounded-lg bg-[#f0dce2] dark:bg-white/10" />
                  <div className="h-4 w-28 animate-pulse rounded bg-[#ead5d5] dark:bg-white/10" />
                </div>
                <div className="h-4 w-4 animate-pulse rounded bg-[#f0e5e3] dark:bg-white/10" />
              </div>
            </div>

            {/* WedPlan Member Card */}
            <div className="mt-auto pt-6">
              <div className="rounded-xl bg-gradient-to-br from-[#68102f] to-[#a51e51] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-5 w-5 animate-pulse rounded-full bg-white/20" />
                  <div className="h-4 w-32 animate-pulse rounded bg-white/20" />
                </div>

                <div className="space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-white/20" />
                  <div className="h-3 w-3/4 animate-pulse rounded bg-white/20" />
                </div>

                <div className="mt-5 h-4 w-28 animate-pulse rounded bg-white/20" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProfileSkeleton;
