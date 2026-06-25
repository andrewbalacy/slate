"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const systemCards = [
  { label: "strict floor",     desc: "Minimum viable execution." },
  { label: "adaptive ceiling", desc: "Capacity-aware expansion." },
  { label: "weekly execution", desc: "Consistency over intensity." },
];

const modules = [
  { href: "/daily",        label: "01", title: "Daily Execution", desc: "Generate today's plan from inputs." },
  { href: "/architecture", label: "02", title: "Architecture",    desc: "Rules, constraints, and system logic." },
  { href: "/logs",         label: "03", title: "Logs",            desc: "Saved execution history and weekly review." },
];

export default function Home() {
  const [phase, setPhase] = useState(0);
  // phase 0: blank → phase 1: title → phase 2: status → phase 3: content

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 80);
    const t2 = setTimeout(() => setPhase(2), 500);
    const t3 = setTimeout(() => setPhase(3), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <main className="relative min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center px-6 py-16 overflow-hidden">

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 50% 18%, rgba(255,255,255,0.034) 0%, transparent 70%)",
        }}
      />

<div className="relative z-10 flex flex-col items-center text-center gap-14 w-full max-w-lg">

        {/* Title — boots first */}
        <div className="flex flex-col items-center gap-4">
          <h1
            className="text-5xl sm:text-6xl font-semibold tracking-[-0.03em] text-white/92"
            style={{
              opacity: phase >= 1 ? 1 : 0,
              transform: phase >= 1 ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            slate.
          </h1>

          {/* Status pill — boots second */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/[0.08]"
            style={{
              background: "rgba(255,255,255,0.03)",
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.45s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <span className="status-dot" />
            <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-white/25">
              system online
            </span>
          </div>

          {/* Subtitle — boots with content */}
          <div
            style={{
              opacity: phase >= 3 ? 1 : 0,
              transform: phase >= 3 ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s, transform 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s",
            }}
          >
            <p className="text-[10px] font-medium tracking-[0.22em] uppercase text-white/22">
              fatigue-aware execution engine
            </p>
            <p className="text-[11px] tracking-[0.16em] uppercase text-white/15 mt-2">
              capacity → rules → execution
            </p>
          </div>
        </div>

        {/* System cards — boots with content */}
        <div
          className="noise relative w-full rounded-2xl border border-white/[0.08] overflow-hidden"
          style={{
            background: "linear-gradient(160deg, rgba(255,255,255,0.033) 0%, rgba(255,255,255,0.013) 100%)",
            boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 48px rgba(0,0,0,0.45)",
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s",
          }}
        >
          {systemCards.map((card, i) => (
            <div
              key={card.label}
              className={`px-7 py-5 flex flex-col gap-1 ${i < systemCards.length - 1 ? "border-b border-white/[0.06]" : ""}`}
            >
              <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/28">{card.label}</p>
              <p className="text-sm text-white/38 leading-snug">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* OS command modules */}
        <div
          className="w-full border-t border-white/[0.06]"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1) 0.16s, transform 0.5s cubic-bezier(0.16,1,0.3,1) 0.16s",
          }}
        >
          {modules.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="cmd-module group relative flex items-center gap-5 px-1 py-5 border-b border-white/[0.06]"
            >
              <span className="cmd-edge absolute left-0 top-1/2 -translate-y-1/2 w-px h-0 bg-white/40 transition-all duration-200 group-hover:h-8" />
              <span className="text-[10px] font-mono text-white/18 group-hover:text-white/35 transition-colors duration-200 w-5 shrink-0 pl-3">
                {mod.label}
              </span>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <p className="text-sm font-medium tracking-tight text-white/60 group-hover:text-white/88 transition-colors duration-200">
                  {mod.title}
                </p>
                <p className="text-xs text-white/22 group-hover:text-white/38 transition-colors duration-200 truncate">
                  {mod.desc}
                </p>
              </div>
              <span className="text-white/18 group-hover:text-white/45 text-xs font-mono transition-all duration-200 group-hover:translate-x-1 shrink-0">
                →
              </span>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <p
          className="text-[10px] tracking-[0.16em] uppercase text-white/14"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transition: "opacity 0.5s ease 0.25s",
          }}
        >
          reduce friction. execute consistently.
        </p>
      </div>
    </main>
  );
}
