
const Loading = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-[#fff8f5] px-4">

      {/* Background Decorations */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#f8dfe2]/50 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#efd4cf]/50 blur-3xl" />

      <div className="relative w-full max-w-md rounded-3xl border border-[#ead8d3] bg-white/90 px-8 py-12 text-center shadow-[0_20px_70px_rgba(90,20,40,0.08)] backdrop-blur-md">

        {/* Logo */}
        <div className="mb-10 flex items-center justify-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-8 w-8 text-[#720e32]"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
          </svg>

          <span className="text-2xl font-bold tracking-tight text-[#720e32]">
            WedPlan
          </span>
        </div>

        {/* Spinner */}
        <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[5px] border-[#f5e5e3]" />

          <div className="absolute inset-0 animate-spin rounded-full border-[5px] border-transparent border-t-[#720e32] border-r-[#720e32]" />

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0f0]">
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8 text-[#720e32]"
              fill="currentColor"
            >
              <path d="M12 21s-8.5-5.2-8.5-11.3A4.7 4.7 0 0 1 12 6.9a4.7 4.7 0 0 1 8.5 2.8C20.5 15.8 12 21 12 21Z" />
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="font-serif text-3xl font-bold text-[#481321]">
          Preparing Your Dream Wedding
        </h2>

        {/* Progress Bar */}
        <div className="mt-9">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold">
            <span className="text-[#720e32]">Loading your experience</span>
            <span className="text-[#720e32]">Please wait</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[#f4e6e4]">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-[#720e32] to-[#b85b78]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
