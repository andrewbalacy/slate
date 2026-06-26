"use client";

import Link from "next/link";
import { memo, useState } from "react";
import type { SlateLog } from "@/types/logs";
import type { FocusData } from "@/components/shell/FocusMode";
import { deriveSystemState, panel } from "./helpers";

const NEXT_ACTION_COPY: Record<string, string> = {
  "Deep Work":      "Single objective. Protect focus.",
  "Standard Plan":  "Execute intentionally. Stop before fatigue compounds.",
  "Strict Floor":   "Protect recovery. Minimum viable execution.",
  "Recovery":       "Reduce load. Prepare for tomorrow.",
};

const EFFORT_MAP: Record<string, string> = {
  "Deep Work":     "High",
  "Standard Plan": "Moderate",
  "Strict Floor":  "Low",
  "Recovery":      "Low",
};

function extractFirstTask(blocks: string[]): string {
  if (!blocks.length) return "Begin floor block";
  const first = blocks[0];
  // strip leading time range if present (e.g. "7:15–7:40 → python (25 min)" → "python (25 min)")
  const arrow = first.indexOf("→");
  return arrow !== -1 ? first.slice(arrow + 1).trim() : first;
}

function extractShutdown(closingLine: string): string | null {
  const match = closingLine.match(/\b(\d{1,2}:\d{2})\b/);
  return match ? match[1] : null;
}

type Props = { log: SlateLog | null; onFocusMode: (d: FocusData) => void };

const NextAction = memo(function NextAction({ log, onFocusMode }: Props) {
  const [hovered, setHovered] = useState(false);

  if (!log) {
    return (
      <div
        className="noise relative w-full rounded-2xl border border-white/[0.08] overflow-hidden"
        style={panel}
      >
        <div className="px-6 py-3.5 border-b border-white/[0.06]">
          <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/22">next action</p>
        </div>
        <div className="px-6 py-6 flex flex-col gap-3">
          <p className="text-sm text-white/28 leading-relaxed">No execution memory available.</p>
          <Link
            href="/daily"
            className="group flex items-center gap-2 text-xs font-medium text-white/38 hover:text-white/65 transition-colors duration-150 w-fit"
          >
            Generate today&apos;s state
            <span className="font-mono transition-transform duration-150 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    );
  }

  const state = deriveSystemState(log);
  const rec = state.recommendation;
  const firstTask = extractFirstTask(log.plan.blocks);
  const shutdown = extractShutdown(log.plan.closingLine);
  const effort = EFFORT_MAP[rec] ?? "Moderate";
  const copy = NEXT_ACTION_COPY[rec] ?? "";

  return (
    <div
      className="noise relative w-full rounded-2xl border border-white/[0.08] overflow-hidden transition-all duration-200 cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...panel,
        ...(hovered && {
          boxShadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 20px 48px rgba(0,0,0,0.5)",
          borderColor: "rgba(255,255,255,0.14)",
          transform: "translateY(-1px)",
        }),
      }}
    >
      <div className="px-6 py-3.5 border-b border-white/[0.06]">
        <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/22">next action</p>
      </div>

      <div className="flex flex-col divide-y divide-white/[0.05]">

        {/* Recommendation */}
        <div className="px-6 py-4 flex flex-col gap-1">
          <p className="text-[9px] font-medium tracking-[0.14em] uppercase text-white/20">recommendation</p>
          <p className="text-sm font-medium text-white/72">{rec}</p>
          <p className="text-[11px] text-white/28 mt-0.5 leading-snug">{copy}</p>
        </div>

        {/* Start with */}
        <div className="px-6 py-4 flex flex-col gap-1">
          <p className="text-[9px] font-medium tracking-[0.14em] uppercase text-white/20">start with</p>
          <p className="text-sm font-mono text-white/55">→ {firstTask}</p>
        </div>

        {/* Effort + Shutdown */}
        <div className="px-6 py-4 grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-[9px] font-medium tracking-[0.14em] uppercase text-white/20">estimated effort</p>
            <p className="text-sm font-mono text-white/52">{effort}</p>
          </div>
          {shutdown && (
            <div className="flex flex-col gap-1">
              <p className="text-[9px] font-medium tracking-[0.14em] uppercase text-white/20">target shutdown</p>
              <p className="text-sm font-mono text-white/52">{shutdown}</p>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="px-6 py-4 flex items-center gap-6">
          <Link
            href="/daily"
            className="group flex items-center gap-2 text-xs font-medium text-white/42 hover:text-white/75 transition-colors duration-150"
          >
            Execute
            <span className="font-mono transition-transform duration-150 group-hover:translate-x-1">→</span>
          </Link>
          <span className="w-px h-3.5 bg-white/[0.08]" />
          <button
            type="button"
            onClick={() => onFocusMode({ objective: firstTask, recommendation: rec, effort, shutdown })}
            className="group flex items-center gap-2 text-xs font-medium text-white/28 hover:text-white/60 transition-colors duration-150"
          >
            Focus Mode
            <span className="font-mono transition-transform duration-150 group-hover:translate-x-0.5">→</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default NextAction;
