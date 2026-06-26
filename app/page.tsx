"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { getLogs } from "@/lib/slateStorage";
import type { SlateLog } from "@/types/logs";
import { useToast } from "@/components/ToastProvider";
import FocusMode, { type FocusData } from "@/components/FocusMode";
import { deriveSystemState, computeInsights } from "@/components/home/helpers";
import QuickActions from "@/components/home/QuickActions";
import NextAction from "@/components/home/NextAction";
import SystemState from "@/components/home/SystemState";
import SystemInsights from "@/components/home/SystemInsights";
import EnergyTrend from "@/components/home/EnergyTrend";
import RecentActivity from "@/components/home/RecentActivity";

function fade(phase: number, threshold: number, delay = 0) {
  return {
    opacity: phase >= threshold ? 1 : 0,
    transform: phase >= threshold ? "translateY(0)" : "translateY(10px)",
    transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  };
}

export default function Home() {
  const [phase, setPhase] = useState(0);
  const [logs, setLogs] = useState<SlateLog[]>([]);
  const [focusData, setFocusData] = useState<FocusData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 80);
    const t2 = setTimeout(() => setPhase(2), 500);
    const t3 = setTimeout(() => setPhase(3), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => { setLogs(getLogs()); }, []);

  const insights = useMemo(() => computeInsights(logs), [logs]);
  const systemState = useMemo(() => logs[0] ? deriveSystemState(logs[0]) : null, [logs]);
  const recent = useMemo(() => logs.slice(0, 3), [logs]);

  const handleFocusMode = useCallback((d: FocusData) => {
    toast("Entering Focus Mode.");
    setFocusData(d);
  }, [toast]);

  return (
    <main className="relative min-h-screen bg-[#080808] text-white px-6 lg:px-10 py-14 overflow-hidden">

      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,255,255,0.032) 0%, transparent 65%)",
      }} />

      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_296px] gap-10 lg:gap-8 items-start">

        {/* ── LEFT COLUMN ─────────────────────────────────────── */}
        <div className="flex flex-col gap-10">

          {/* Hero */}
          <div className="flex flex-col items-start gap-4 pt-4">
            <h1 className="text-5xl sm:text-6xl font-semibold tracking-[-0.03em] text-white/92" style={fade(phase, 1)}>
              slate.
            </h1>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/[0.08]"
              style={{ background: "rgba(255,255,255,0.03)", ...fade(phase, 2) }}>
              <span className="status-dot" />
              <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-white/25">system online</span>
            </div>

            <div style={fade(phase, 3, 0.05)}>
              <p className="text-[10px] font-medium tracking-[0.22em] uppercase text-white/22">
                fatigue-aware execution engine
              </p>
              <p className="text-[11px] tracking-[0.16em] uppercase text-white/15 mt-1.5">
                capacity → rules → execution
              </p>
            </div>
          </div>

          {/* Card stack */}
          <div className="flex flex-col gap-4 w-full" style={fade(phase, 3, 0.1)}>
            <QuickActions />
            <NextAction log={logs[0] ?? null} onFocusMode={handleFocusMode} />
          </div>

          <p className="text-[10px] tracking-[0.16em] uppercase text-white/14" style={{ opacity: phase >= 3 ? 1 : 0, transition: "opacity 0.5s ease 0.25s" }}>
            reduce friction. execute consistently.
          </p>
        </div>

        {/* ── RIGHT COLUMN — system sidebar ───────────────────── */}
        <div className="flex flex-col gap-5" style={fade(phase, 3, 0.2)}>
          <SystemState systemState={systemState} />
          <SystemInsights insights={insights} />
          <EnergyTrend logs={logs} />
          <RecentActivity recent={recent} />
        </div>
      </div>

      {focusData && (
        <FocusMode
          {...focusData}
          onExit={() => {
            toast("Focus Mode ended.");
            setFocusData(null);
          }}
        />
      )}
    </main>
  );
}
