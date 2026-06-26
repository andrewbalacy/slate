"use client";

import { useState } from "react";
import { derivePreview } from "./SystemStatePreview";
import type { CognitiveLoad, YesNo } from "@/types/slate";

type ProtocolKey = "Deep Work" | "Standard Plan" | "Strict Floor" | "Recovery";

const PROTOCOLS: Record<ProtocolKey, { desc: string; rules: string[]; examples: string[] }> = {
  "Deep Work": {
    desc: "High-capacity window. Sustained focus, zero context switching.",
    rules: [
      "One primary objective per session",
      "90-minute blocks minimum",
      "No notifications, no admin",
      "Stop before fatigue sets in",
    ],
    examples: [
      "MSHI coursework — deep module",
      "Building Slate — architecture or feature",
      "Python study — advanced problem set",
    ],
  },
  "Standard Plan": {
    desc: "Balanced execution. Core blocks completed, headroom preserved.",
    rules: [
      "Floor block first, every time",
      "Maximum two focus sessions",
      "Short break between blocks",
      "Light admin permitted",
    ],
    examples: [
      "Python study — 25 min",
      "MSHI coursework — single module",
      "Administrative tasks",
    ],
  },
  "Strict Floor": {
    desc: "Minimum viable execution. One block. Protect energy. Nothing more.",
    rules: [
      "Single 25-min growth block only",
      "No extensions under any condition",
      "Light movement if tolerated",
      "Early sleep prioritized",
    ],
    examples: [
      "Python study — 25 min",
      "One MSHI lecture",
      "Brief admin if unavoidable",
    ],
  },
  "Recovery": {
    desc: "Off-day protocol. Front-load movement, then light work. Free after.",
    rules: [
      "Movement block before cognitive work",
      "No forced output or deadlines",
      "Admin and review permitted",
      "Sunday: include financial check-in",
    ],
    examples: [
      "Zone 2 movement — 30–40 min",
      "Python study — optional 25 min",
      "Administrative tasks",
      "Financial review (Sunday only)",
    ],
  },
};

export function RecommendationProtocol({ energy, cognitiveLoad, workToday }: {
  energy: number | null;
  cognitiveLoad: CognitiveLoad | "";
  workToday: YesNo | "";
}) {
  const [open, setOpen] = useState(false);
  const state = derivePreview(energy, cognitiveLoad, workToday);
  if (!state || state.recommendation === "—") return null;

  const key = state.recommendation as ProtocolKey;
  const protocol = PROTOCOLS[key];
  if (!protocol) return null;

  return (
    <div
      className="rounded-xl border border-white/[0.06] overflow-hidden"
      style={{ background: "rgba(255,255,255,0.01)" }}
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3 group"
      >
        <div className="flex items-center gap-2.5">
          <p className="text-[9px] font-medium tracking-[0.18em] uppercase text-white/18">protocol</p>
          <p className="text-[10px] font-medium text-white/40 group-hover:text-white/60 transition-colors duration-150">{key}</p>
        </div>
        <span
          className="text-white/18 font-mono text-[10px] transition-transform duration-200 group-hover:text-white/35"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>

      {open && (
        <div className="border-t border-white/[0.05]">
          <div className="px-5 py-3">
            <p className="text-[11px] text-white/30 leading-relaxed">{protocol.desc}</p>
          </div>

          <div className="px-5 pb-3 border-t border-white/[0.04]">
            <p className="text-[8px] font-medium tracking-[0.16em] uppercase text-white/15 pt-3 pb-2">execution rules</p>
            <ul className="flex flex-col gap-1.5">
              {protocol.rules.map((rule, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-white/12 font-mono text-[9px] mt-px shrink-0">—</span>
                  <span className="text-[11px] text-white/30">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-5 pb-4 border-t border-white/[0.04]">
            <p className="text-[8px] font-medium tracking-[0.16em] uppercase text-white/15 pt-3 pb-2">examples</p>
            <ul className="flex flex-col gap-1.5">
              {protocol.examples.map((ex, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-white/12 font-mono text-[9px] mt-px shrink-0">·</span>
                  <span className="text-[11px] text-white/30">{ex}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
