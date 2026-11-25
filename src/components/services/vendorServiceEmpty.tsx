
import Link from "next/link";
import { ArrowRight, Plus, Search } from "lucide-react";

const VendorServiceEmpty = () => {
  return (
    <section className="relative flex min-h-[500px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#fff7fb] px-5 py-12 text-center transition-colors duration-300 dark:bg-[#100711]">

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-40 w-72 rounded-[50%] border border-pink-300/30 bg-pink-400/10 blur-sm dark:border-pink-700/30 dark:bg-pink-600/10" />

      <div className="pointer-events-none absolute -bottom-24 -right-10 h-40 w-72 rounded-[50%] border border-pink-300/30 bg-pink-400/10 blur-sm dark:border-pink-700/30 dark:bg-pink-600/10" />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">

        {/* Illustration */}
        <div className="mb-5 w-full max-w-[370px]">
          <svg
            viewBox="0 0 400 230"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-auto w-full"
          >
            <defs>
              <linearGradient id="calendarBody" x1="120" y1="40" x2="240" y2="190">
                <stop stopColor="#FBC5E5" />
                <stop offset="1" stopColor="#E9A5D9" />
              </linearGradient>

              <linearGradient id="calendarTop" x1="140" y1="20" x2="220" y2="80">
                <stop stopColor="#FF83BD" />
                <stop offset="1" stopColor="#E62D82" />
              </linearGradient>

              <linearGradient id="clockGradient" x1="260" y1="90" x2="330" y2="170">
                <stop stopColor="#FF80B9" />
                <stop offset="1" stopColor="#E52C80" />
              </linearGradient>

              <filter id="shadow" x="40" y="0" width="320" height="230">
                <feGaussianBlur stdDeviation="9" />
              </filter>
            </defs>

            {/* Background Shapes */}
            <ellipse
              cx="200"
              cy="207"
              rx="175"
              ry="17"
              fill="#B20E70"
              opacity=".15"
            />

            <path
              d="M90 65C90 25 125 10 155 20C180 -5 220 5 240 23C280 0 320 28 315 65C355 90 330 135 290 145H100C45 140 35 90 90 65Z"
              fill="#D62C91"
              opacity=".12"
            />

            {/* Calendar Shadow */}
            <path
              d="M115 55L247 60L239 185L103 175L115 55Z"
              fill="#E52B8A"
              opacity=".15"
              filter="url(#shadow)"
            />

            {/* Calendar Body */}
            <g transform="rotate(6 180 110)">
              <rect
                x="110"
                y="42"
                width="145"
                height="140"
                rx="15"
                fill="url(#calendarBody)"
              />

              <path
                d="M110 57C110 48.7 116.7 42 125 42H240C248.3 42 255 48.7 255 57V75H110V57Z"
                fill="url(#calendarTop)"
              />

              {/* Calendar Rings */}
              {[132, 176, 220].map((x) => (
                <g key={x}>
                  <rect
                    x={x}
                    y="29"
                    width="15"
                    height="36"
                    rx="7.5"
                    fill="#D61F78"
                  />
                  <rect
                    x={x + 3}
                    y="27"
                    width="9"
                    height="32"
                    rx="4.5"
                    fill="#F65CA5"
                  />
                </g>
              ))}

              {/* Calendar Dates */}
              {Array.from({ length: 12 }).map((_, i) => (
                <rect
                  key={i}
                  x={126 + (i % 4) * 29}
                  y={88 + Math.floor(i / 4) * 29}
                  width="19"
                  height="19"
                  rx="5"
                  fill="#E89BD1"
                  opacity=".85"
                />
              ))}
            </g>

            {/* Clock */}
            <circle cx="285" cy="130" r="45" fill="#B8176F" opacity=".15" />
            <circle cx="285" cy="126" r="43" fill="url(#clockGradient)" />
            <circle cx="285" cy="126" r="35" fill="#FCE2F2" />

            {/* Clock Markers */}
            {[0, 90, 180, 270].map((angle) => (
              <rect
                key={angle}
                x="283"
                y="97"
                width="4"
                height="7"
                rx="2"
                fill="#D72C81"
                transform={`rotate(${angle} 285 126)`}
              />
            ))}

            {/* Clock Hands */}
            <path
              d="M285 126L285 108M285 126L304 117"
              stroke="#D72C81"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="285" cy="126" r="5" fill="#D72C81" />

            {/* Cancel Icon */}
            <circle cx="68" cy="119" r="24" fill="#E52C83" />
            <path
              d="M60 111L76 127M76 111L60 127"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Decorative Stars */}
            <path d="M80 27L84 39L96 43L84 47L80 59L76 47L64 43L76 39Z" fill="#D72C91" opacity=".5" />
            <path d="M350 40L360 23M360 55L374 47M362 70L377 73" stroke="#E52C83" strokeWidth="6" strokeLinecap="round" />
            <path d="M35 160L39 168L47 172L39 176L35 184L31 176L23 172L31 168Z" fill="#D72C91" opacity=".4" />
            <path d="M345 158L349 166L357 170L349 174L345 182L341 174L333 170L341 166Z" fill="#D72C91" opacity=".4" />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold tracking-tight text-[#261522] sm:text-3xl md:text-[34px] dark:text-white">
          <span className="text-[#e52d82]">Service</span>{" "}
          not found
        </h2>

        {/* Description */}
        <p className="mt-3 max-w-[490px] text-sm leading-6 text-gray-600 sm:text-base dark:text-[#c4b4c8]">
          Please add your service
        </p>

        {/* Action Button */}
        <Link
          href="/dashboard/vendor/services/new"
          className="mt-6 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#ed2781] to-[#d92379] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/30 active:scale-95"
        >
          <Plus size={19} />
          Add Service
        </Link>

      </div>
    </section>
  );
};

export default VendorServiceEmpty;
