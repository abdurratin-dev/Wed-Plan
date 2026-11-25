
const Loading = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8 sm:px-6"
    >
      {/* Background Decorations */}
      <div
        aria-hidden="true"
        className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#f8dfe2]/50 blur-3xl dark:bg-[#a52b50]/20"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-[#efd4cf]/50 blur-3xl dark:bg-[#720e32]/25"
      />

      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card/90 px-6 py-10 text-center shadow-[0_20px_70px_rgba(90,20,40,0.08)] backdrop-blur-md sm:px-8 dark:shadow-[0_20px_70px_rgba(0,0,0,0.5)]">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="h-8 w-8 text-[#720e32] dark:text-[#ff9bb9]"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
          </svg>

          <span className="text-2xl font-bold tracking-tight text-[#720e32] dark:text-[#ff9bb9]">
            WedPlan
          </span>
        </div>

        {/* Spinner with subtle pulse ring */}
        <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center">
          <div
            aria-hidden="true"
            className="absolute inset-0 animate-ping rounded-full border border-[#720e32]/25 dark:border-[#ff9bb9]/25"
          />
          <div className="absolute inset-0 rounded-full border-[5px] border-[#f5e5e3] dark:border-white/10" />

          <div className="absolute inset-0 animate-spin rounded-full border-[5px] border-transparent border-t-[#720e32] border-r-[#720e32] dark:border-t-[#a52b50] dark:border-r-[#a52b50]" />

          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0f0] dark:bg-[#2f1e28]">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-8 w-8 text-[#720e32] dark:text-[#ff9bb9]"
              fill="currentColor"
            >
              <path d="M12 21s-8.5-5.2-8.5-11.3A4.7 4.7 0 0 1 12 6.9a4.7 4.7 0 0 1 8.5 2.8C20.5 15.8 12 21 12 21Z" />
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
          Preparing Your Dream Wedding
        </h2>
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          Loading…
        </p>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#720e32] dark:text-[#ff9bb9]">
            <span>Loading your experience</span>
            <span>Please wait</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[#f4e6e4] dark:bg-white/10">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-[#720e32] to-[#b85b78] dark:from-[#a52b50] dark:to-[#ff9bb9]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
