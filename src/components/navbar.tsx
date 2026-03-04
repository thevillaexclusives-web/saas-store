"use client";

import Link from "next/link";
import { Search, ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const navTabs = ["Buy", "Sell", "Rent"] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border-subtle">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex h-[72px] items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-sand-500 to-sand-700 shadow-sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5 text-white"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-stone-900">
              Villa<span className="text-sand-600">Hub</span>
            </span>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-stone-400 transition-colors group-focus-within:text-sand-600" />
              <input
                type="text"
                placeholder="Search destinations, properties..."
                className="w-full h-11 pl-11 pr-4 bg-stone-50 border border-border-subtle rounded-full text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sand-300/50 focus:border-sand-300 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Navigation tabs */}
          <nav className="hidden lg:flex items-center bg-stone-100 rounded-full p-1">
            {navTabs.map((tab, i) => (
              <button
                key={tab}
                className={cn(
                  "px-5 py-2 text-sm font-medium rounded-full transition-all",
                  i === 2
                    ? "bg-stone-900 text-white shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                )}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm text-stone-600 hover:text-stone-800 transition-colors">
              <Globe className="w-4 h-4" />
              <span>USD</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <button className="h-10 px-6 text-sm font-semibold text-white bg-stone-900 rounded-full hover:bg-stone-800 active:scale-[0.97] transition-all shadow-sm">
              Login
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
