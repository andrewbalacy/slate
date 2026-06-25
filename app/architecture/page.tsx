"use client";

import Link from "next/link";
import { useState } from "react";

const sections = [
  {
    title: "Strict Floor",
    body: "Every day includes one 25-minute growth block. On high-load workdays, this is the only required output.",
  },
  {
    title: "Adaptive Ceiling",
    body: "Additional blocks appear only when energy and cognitive load allow. Slate scales down before it scales up.",
  },
  {
    title: "Training Logic",
    body: "Training is prescribed based on work status, energy, and readiness constraints. No ego pace. No forced intensity.",
  },
  {
    title: "Financial Review",
    body: "Sunday includes a short financial check-in only. No daily financial obsession.",
  },
  {
    title: "Weekly Execution",
    body: "Weekly consistency is reviewed on Sundays only. Completion is tracked without streak pressure.",
  },
];

export default function Architecture() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main className="relative min-h-screen bg-[#080808] text-white px-6 py-8 flex flex-col overflow-hidden">

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 20%, rgba(255,255,255,0.032) 0%, transparent 70%)",
        }}
      />

      <Link
        href="/"
        className="relative z-10 text-sm font-semibold tracking-tight text-white/40 hover:text-white/70 transition-colors duration-200 w-fit"
      >
        slate.
      </Link>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-14 py-12">

        <div className="flex flex-col items-center text-center gap-3">
          <h1 className="text-3xl sm:text-[2.25rem] font-semibold tracking-[-0.02em] text-white/90">
            architecture
          </h1>
          <p className="text-[10px] font-medium tracking-[0.22em] uppercase text-white/22">
            rules → constraints → execution
          </p>
        </div>

        <div
          className="w-full max-w-md rounded-2xl border border-white/[0.08] overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 100%)",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 48px rgba(0,0,0,0.4)",
          }}
        >
          {sections.map((section, i) => (
            <div
              key={section.title}
              className={i < sections.length - 1 ? "border-b border-white/[0.07]" : ""}
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-8 py-5 flex items-center justify-between text-left group hover:bg-white/[0.02] transition-colors duration-150"
              >
                <span className="text-sm font-medium text-white/75 group-hover:text-white/90 transition-colors duration-150 tracking-tight">
                  {section.title}
                </span>
                <span
                  className="text-white/25 text-xs ml-4 transition-transform duration-200 select-none"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
              </button>

              {open === i && (
                <div className="px-8 pb-6 border-t border-white/[0.05]">
                  <p className="pt-4 text-sm text-white/38 leading-relaxed tracking-wide">
                    {section.body}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="text-xs text-white/22 hover:text-white/50 transition-colors duration-200 tracking-wide"
        >
          ← back
        </Link>
      </div>
    </main>
  );
}
