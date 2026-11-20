"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Building2,
  Cake,
  Camera,
  CalendarDays,
  ChevronUp,
  Filter,
  Mail,
  MapPin,
  Music,
  Palette,
  Search,
  Sparkles,
  Star,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ServiceData } from "@/types/apidata";
import { getServiceData } from "@/lib/actions/api/service";
import ServiceCard from "./ServiceCard";
import { useRouter } from "next/navigation";
import { Categorys } from "@/types/othersType";

export const CATEGORIES: Categorys[] = [
  { label: "Photography", value: "photography", isActive: false },
  { label: "Decoration & Styling", value: "decoration", isActive: false },
  { label: "Catering", value: "catering", isActive: false },
  { label: "Makeup & Beauty", value: "makeup", isActive: false },
  { label: "Venue", value: "venue", isActive: false },
  { label: "Entertainment", value: "entertainment", isActive: false },
  { label: "Others", value: "others", isActive: false },
];

type Category =
  | "photography"
  | "decoration"
  | "catering"
  | "makeup"
  | "venue"
  | "entertainment"
  | "others";

export const LOCATIONS = ["Dhaka", "Chattogram", "Sylhet", "Khulna", "Rajshahi"];

const SORTS = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "low", label: "Price: Low to High" },
  { value: "high", label: "Price: High to Low" },
] as const;

type SortValue = (typeof SORTS)[number]["value"];

const selectClass =
  "w-full rounded-xl border border-[#eee2dd] bg-[#fdfbfa] px-3.5 py-3 text-sm text-[#2b0713] outline-none transition focus:border-[#720e32] focus:ring-2 focus:ring-[#720e32]/15 dark:border-white/10 dark:bg-[#241720] dark:text-white dark:focus:border-[#ff9bb9] dark:focus:ring-[#ff9bb9]/15 dark:[color-scheme:dark]";

const formatPrice = (value: number) => value.toLocaleString("en-US");

type Criteria = {
  query: string;
  categories: Category[];
  location: string;
  price: string;
};

/** Shared predicate used by both the results grid and the summary counts. */

export default function BrowseServices({results}:{results:ServiceData[]}) {
  const [qsearch, setSearch] = useState("");
  const [picked, setPicked] = useState('');
  const [location, setLocation] = useState("All Locations");
  const [sort, setSort] = useState<SortValue>("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(true);
  const router = useRouter();
  const params = new URLSearchParams();
  const applyFilters = () => {
    if(picked){
      params.set("category", picked);
    }
    if(location !== 'All Locations'){
      params.set('location',location);
    }
    router.push(`?${params.toString()}`);
  };
  const resetFilters = ()=>{
    setPicked('')
    setLocation('All Locations')
  }
  const AllresetFilters = ()=>{
    router.push(`/services`)
  }
  const search = (event: React.FormEvent) => {
    event.preventDefault();
    params.set('search',qsearch)
    router.push(`?${params.toString()}`)
  };
  return (
    <div className="min-h-screen bg-[#fdfbfa] pb-20 dark:bg-[#160e13]">
      {/* ---------------- Hero banner ---------------- */}
      <div className="relative isolate overflow-hidden">
        <Image
          src="/services-banner.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#fffaf7] via-[#fffaf7]/90 to-[#fffaf7]/30 dark:from-[#160e13] dark:via-[#160e13]/90 dark:to-[#160e13]/45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#fffaf7]/70 via-transparent to-[#fffaf7]/60 dark:from-[#160e13]/70 dark:to-[#160e13]/60" />

        <div className="mx-auto w-full max-w-[1500px] px-4 pt-7 pb-9 sm:px-6 lg:px-10 lg:pt-9 lg:pb-12">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-medium text-[#8a7a80] dark:text-[#9b8792]"
          >
            <Link
              href="/"
              className="transition hover:text-[#720e32] dark:hover:text-[#ff9bb9]"
            >
              Home
            </Link>
            <span
              aria-hidden="true"
              className="text-[#c4b4ba] dark:text-[#6f5c66]"
            >
              /
            </span>
            <span
              aria-current="page"
              className="text-[#4a3a41] dark:text-[#d5c1ca]"
            >
              Browse Services
            </span>
          </nav>

          <h1 className="font-heading mt-4 text-4xl font-semibold tracking-tight text-[#2b0713] sm:text-5xl dark:text-[#ffeaf1]">
            Browse Services
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#6b5a61] sm:text-[0.95rem] dark:text-[#c8b3bd]">
            Discover and book the best wedding services from trusted vendors for
            your special day.
          </p>

          {/* Search */}
          <form
            onSubmit={search}
            role="search"
            className="mt-6 flex max-w-xl items-center gap-2.5"
          >
            <div className="relative flex-1">
              <Search
                size={17}
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#a89a9f] dark:text-[#8d7a84]"
              />
              <input
                type="search"
                value={qsearch}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search services..."
                aria-label="Search services"
                className="w-full rounded-full border border-[#eee2dd] bg-white py-3.5 pr-4 pl-11 text-sm text-[#2b0713] shadow-[0_16px_36px_-30px_rgba(114,14,50,0.6)] outline-none transition placeholder:text-[#a89a9f] focus:border-[#720e32] focus:ring-2 focus:ring-[#720e32]/15 dark:border-white/10 dark:bg-[#241720] dark:text-white dark:placeholder:text-[#8d7a84] dark:focus:border-[#ff9bb9] dark:focus:ring-[#ff9bb9]/15"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 rounded-full bg-[#720e32] px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#570a26] focus-visible:ring-2 focus-visible:ring-[#720e32]/40 focus-visible:outline-none dark:bg-[#a52b50] dark:hover:bg-[#c13b64] dark:focus-visible:ring-[#ff9bb9]/40"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* ---------------- Body ---------------- */}
      <div className="mx-auto w-full max-w-[1500px] px-4 pt-7 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-7">
          {/* ---------- Filter sidebar ---------- */}
          <aside className="lg:w-[276px] lg:shrink-0">
            <div
              id="filter-panel"
              className={cn(
                "mt-3 rounded-2xl border border-[#f1ded7] bg-white p-5 shadow-[0_24px_50px_-40px_rgba(114,14,50,0.6)] lg:mt-0 lg:sticky lg:top-24 lg:block dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none",
                filtersOpen ? "block" : "hidden",
              )}
            >
              <div className="flex items-center justify-between border-b border-[#f6ece8] pb-3.5 dark:border-white/10">
                <h2 className="flex items-center gap-2 text-[0.95rem] font-bold text-[#2b0713] dark:text-[#ffeaf1]">
                  <Filter
                    size={16}
                    className="text-[#a52b50] dark:text-[#ff9bb9]"
                  />
                  Filter By
                </h2>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[0.7rem] font-bold tracking-wide text-[#a52b50] uppercase transition hover:text-[#720e32] dark:text-[#ff9bb9] dark:hover:text-[#ffb0c5]"
                >
                  Reset
                </button>
              </div>

              {/* Category */}
              <div className="border-b border-[#f6ece8] py-4 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setCategoryOpen((open) => !open)}
                  aria-expanded={categoryOpen}
                  aria-controls="category-list"
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="text-sm font-bold text-[#2b0713] dark:text-[#ffeaf1]">
                    Category
                  </span>
                  <ChevronUp
                    size={16}
                    className={cn(
                      "text-[#8a7a80] transition-transform dark:text-[#9b8792]",
                      categoryOpen ? "" : "rotate-180",
                    )}
                  />
                </button>

                <div
                  id="category-list"
                  className={cn(
                    "mt-3 flex flex-col gap-2.5",
                    categoryOpen ? "flex" : "hidden",
                  )}
                >
                  {CATEGORIES.map((category) => {
                    return (
                      <label
                        key={category.value}
                        className="flex cursor-pointer items-center gap-3 text-sm"
                      >
                        <input
                          type="radio"
                          checked={picked === category.value}
                          onChange={() => {
                            if(picked === category.value){
                              setPicked('')
                              console.log(picked);
                            }
                            setPicked(category.value);
                          }}
                          className="peer sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={cn(
                            "flex size-4.5 shrink-0 items-center justify-center rounded border transition peer-focus-visible:ring-2 peer-focus-visible:ring-[#720e32]/40",
                            picked === category.value
                              ? "border-[#720e32] bg-[#720e32] dark:border-[#ff9bb9] dark:bg-[#ff9bb9]"
                              : "border-[#d8c8cd] bg-white dark:border-white/20 dark:bg-[#241720]",
                          )}
                        >
                          {picked === category.value && (
                            <svg
                              viewBox="0 0 12 12"
                              className="size-3 text-white dark:text-[#160e13]"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M2.5 6.2 5 8.7l4.5-5" />
                            </svg>
                          )}
                        </span>
                        <span
                          className={cn(
                            "flex-1 truncate font-medium",
                            picked === category.value
                              ? "text-[#720e32] dark:text-[#ff9bb9]"
                              : "text-[#4a3a41] dark:text-[#d5c1ca]",
                          )}
                        >
                          {category.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Location */}
              <div className="border-b border-[#f6ece8] py-4 dark:border-white/10">
                <label
                  htmlFor="filter-location"
                  className="mb-2.5 flex items-center gap-2 text-sm font-bold text-[#2b0713] dark:text-[#ffeaf1]"
                >
                  <MapPin
                    size={15}
                    className="text-[#a52b50] dark:text-[#ff9bb9]"
                  />
                  Location
                </label>
                <select
                  id="filter-location"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className={selectClass}
                >
                  <option>All Locations</option>
                  {LOCATIONS.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={applyFilters}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#720e32] px-4 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#570a26] focus-visible:ring-2 focus-visible:ring-[#720e32]/40 focus-visible:outline-none dark:bg-[#a52b50] dark:hover:bg-[#c13b64] dark:focus-visible:ring-[#ff9bb9]/40"
              >
                <Filter size={15} strokeWidth={2.5} />
                Apply Filter
              </button>
            </div>
          </aside>

          {/* ---------- Results ---------- */}
          <section className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p
                role="status"
                className="text-sm font-medium text-[#6b5a61] dark:text-[#c8b3bd]"
              >
                Showing{" "}
                <span className="font-bold text-[#2b0713] dark:text-[#ffeaf1]">
                  {results.length}
                </span>{" "}
                of {results.length} services
              </p>

              <label className="flex items-center gap-2.5 text-sm font-medium text-[#6b5a61] dark:text-[#c8b3bd]">
                Sort by:
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortValue)}
                  aria-label="Sort services"
                  className="rounded-xl border border-[#eee2dd] bg-white px-3 py-2 text-sm font-semibold text-[#2b0713] outline-none transition focus:border-[#720e32] focus:ring-2 focus:ring-[#720e32]/15 dark:border-white/10 dark:bg-[#241720] dark:text-white dark:focus:border-[#ff9bb9] dark:focus:ring-[#ff9bb9]/15 dark:[color-scheme:dark]"
                >
                  {SORTS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Grid */}
            {results.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((service) => {
                  return <ServiceCard key={service._id} service={service} />;
                })}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-[#e3c3bd] bg-white px-6 py-16 text-center dark:border-white/15 dark:bg-[#1e131a]">
                <Search
                  size={30}
                  aria-hidden="true"
                  className="mx-auto text-[#c4b4ba] dark:text-[#6f5c66]"
                />
                <h3 className="font-heading mt-4 text-xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
                  No services found
                </h3>
                <p className="mt-2 text-sm text-[#6b5a61] dark:text-[#c8b3bd]">
                  Try a different search term or clear your filters.
                </p>
                <button
                  type="button"
                  onClick={AllresetFilters}
                  className="mt-5 rounded-xl bg-[#720e32] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#570a26] dark:bg-[#a52b50] dark:hover:bg-[#c13b64]"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
