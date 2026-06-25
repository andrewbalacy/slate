"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getLogs, type SlateLog } from "@/lib/slateStorage";

// ── data ─────────────────────────────────────────────────────────────────────

const quickActions = [
  { href: "/daily",        label: "Daily Execution" },
  { href: "/logs",         label: "Logs" },
  { href: "/architecture", label: "Architecture" },
];

// ── helpers ───────────────────────────────────────────────────────────────────

function deriveSystemState(log: SlateLog) {
  const { energy, cognitiveLoad, workToday } = log.input;
  const capacity = energy >= 8 ? "High" : energy >= 5 ? "Moderate" : "Low";
  const mode = workToday === "yes" ? "Execution" : "Recovery / Build";
  const recoveryRisk = cognitiveLoad === "high" && energy <= 5 ? "Elevated" : "Low";
  const recommendation =
    workToday === "no" ? "Recovery"
    : energy <= 4 || recoveryRisk === "Elevated" ? "Strict Floor"
    : energy >= 8 ? "Deep Work"
    : "Standard Plan";
  return { energy, capacity, mode, recoveryRisk, recommendation };
}

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

function computeInsights(logs: SlateLog[]) {
  if (!logs.length) return null;
  const avgEnergy = logs.reduce((s, l) => s + l.input.energy, 0) / logs.length;
  const workDays = logs.filter(l => l.input.workToday === "yes").length;
  const trainingDays = logs.filter(l => l.input.trainingToday === "yes").length;
  const freq: Record<string, number> = {};
  for (const l of logs) if (l.input.constraint) freq[l.input.constraint] = (freq[l.input.constraint] ?? 0) + 1;
  const topConstraint = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  return { total: logs.length, avgEnergy, workDays, trainingDays, topConstraint };
}

// ── next action card ─────────────────────────────────────────────────────────

function NextActionCard({ log }: { log: SlateLog | null }) {
  const [hovered, setHovered] = useState(false);

  if (!log) {
    return (
      <div
        className="noise relative w-full rounded-2xl border overflow-hidden transition-all duration-200"
        style={{
          background: "linear-gradient(160deg, rgba(255,255,255,0.033) 0%, rgba(255,255,255,0.013) 100%)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 16px 40px rgba(0,0,0,0.45)",
          borderColor: "rgba(255,255,255,0.08)",
        }}
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
            Generate today's state
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
      className="noise relative w-full rounded-2xl border overflow-hidden transition-all duration-200 cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "linear-gradient(160deg, rgba(255,255,255,0.033) 0%, rgba(255,255,255,0.013) 100%)",
        boxShadow: hovered
          ? "0 1px 0 rgba(255,255,255,0.08) inset, 0 20px 48px rgba(0,0,0,0.5)"
          : "0 1px 0 rgba(255,255,255,0.06) inset, 0 16px 40px rgba(0,0,0,0.45)",
        borderColor: hovered ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.08)",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
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

        {/* Execute CTA */}
        <div className="px-6 py-4">
          <Link
            href="/daily"
            className="group flex items-center gap-2 text-xs font-medium text-white/42 hover:text-white/75 transition-colors duration-150 w-fit"
          >
            Execute
            <span className="font-mono transition-transform duration-150 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── sub-components ─────────────────────────────────────────────────────────────

function MiniEnergyChart({ logs }: { logs: SlateLog[] }) {
  const pts = [...logs].reverse().slice(0, 7);
  if (pts.length < 2) return (
    <p className="px-5 py-4 text-[10px] text-white/18 italic">Not enough data.</p>
  );
  const W = 260; const H = 52; const PY = 4;
  const plotH = H - PY * 2;
  const points = pts.map((l, i) => ({
    x: (i / (pts.length - 1)) * W,
    y: PY + plotH - ((l.input.energy - 1) / 9) * plotH,
    label: l.input.date.slice(5),
  }));
  const poly = points.map(p => `${p.x},${p.y}`).join(" ");
  const area = [`M ${points[0].x},${H}`, ...points.map(p => `L ${p.x},${p.y}`), `L ${points[points.length-1].x},${H}`, "Z"].join(" ");
  return (
    <div className="px-5 pb-4 pt-1">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 52 }} preserveAspectRatio="none">
        <path d={area} fill="rgba(255,255,255,0.025)" />
        <polyline points={poly} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="2" fill="#080808" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />)}
      </svg>
      <div className="flex justify-between mt-1">
        {points.map((p, i) => <span key={i} className="text-[8px] font-mono text-white/16" style={{ width: `${100/points.length}%`, textAlign: "center" }}>{p.label}</span>)}
      </div>
    </div>
  );
}

// ── panel style ───────────────────────────────────────────────────────────────

const panel = {
  background: "linear-gradient(160deg, rgba(255,255,255,0.033) 0%, rgba(255,255,255,0.013) 100%)",
  boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 16px 40px rgba(0,0,0,0.45)",
};

function fade(phase: number, threshold: number, delay = 0) {
  return {
    opacity: phase >= threshold ? 1 : 0,
    transform: phase >= threshold ? "translateY(0)" : "translateY(10px)",
    transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  };
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [phase, setPhase] = useState(0);
  const [logs, setLogs] = useState<SlateLog[]>([]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 80);
    const t2 = setTimeout(() => setPhase(2), 500);
    const t3 = setTimeout(() => setPhase(3), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => { setLogs(getLogs()); }, []);

  const insights = computeInsights(logs);
  const systemState = logs[0] ? deriveSystemState(logs[0]) : null;
  const recent = logs.slice(0, 3);

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

          {/* Quick Actions */}
          <div
            className="noise relative w-full rounded-2xl border border-white/[0.08] overflow-hidden"
            style={{ ...panel, ...fade(phase, 3, 0.1) }}
          >
            <div className="px-6 py-3 border-b border-white/[0.06]">
              <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/22">quick actions</p>
            </div>
            {quickActions.map((action, i) => (
              <Link
                key={action.href}
                href={action.href}
                className="cmd-module group relative flex items-center justify-between px-6 py-3.5 border-b border-white/[0.05] last:border-b-0"
              >
                <span className="cmd-edge absolute left-0 top-1/2 -translate-y-1/2 w-px h-0 bg-white/35 transition-all duration-150 group-hover:h-6" />
                <span className="text-sm font-medium text-white/52 group-hover:text-white/85 transition-colors duration-150 pl-1">
                  {action.label}
                </span>
                <span className="text-white/18 group-hover:text-white/42 text-xs font-mono transition-all duration-150 group-hover:translate-x-0.5">→</span>
              </Link>
            ))}
          </div>

          {/* Next Action */}
          <div style={fade(phase, 3, 0.13)}>
            <NextActionCard log={logs[0] ?? null} />
          </div>

          <p className="text-[10px] tracking-[0.16em] uppercase text-white/14" style={{ opacity: phase >= 3 ? 1 : 0, transition: "opacity 0.5s ease 0.25s" }}>
            reduce friction. execute consistently.
          </p>
        </div>

        {/* ── RIGHT COLUMN — system sidebar ───────────────────── */}
        <div className="flex flex-col gap-5" style={fade(phase, 3, 0.2)}>

          {/* System State */}
          <div className="noise relative w-full rounded-2xl border border-white/[0.08] overflow-hidden" style={panel}>
            <div className="px-5 py-3.5 border-b border-white/[0.06]">
              <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/28">system state</p>
            </div>
            {!systemState ? (
              <div className="px-5 py-5">
                <p className="text-[11px] text-white/18 leading-relaxed">No system state yet. Generate and save a daily log.</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-white/[0.05]">
                {[
                  { label: "energy",      value: String(systemState.energy) },
                  { label: "capacity",    value: systemState.capacity },
                  { label: "mode",        value: systemState.mode },
                  { label: "risk",        value: systemState.recoveryRisk },
                  { label: "recommendation", value: systemState.recommendation },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-5 py-3">
                    <span className="text-[9px] font-medium tracking-[0.14em] uppercase text-white/22">{label}</span>
                    <span className="text-xs font-mono text-white/55">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System Insights */}
          <div className="noise relative w-full rounded-2xl border border-white/[0.08] overflow-hidden" style={panel}>
            <div className="px-5 py-3.5 border-b border-white/[0.06]">
              <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/28">system insights</p>
            </div>
            {!insights ? (
              <div className="px-5 py-5">
                <p className="text-[11px] text-white/18 italic">No execution memory yet.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.05]">
                  {[
                    { label: "logged",   value: String(insights.total) },
                    { label: "avg energy", value: insights.avgEnergy.toFixed(1) },
                    { label: "work days", value: String(insights.workDays) },
                    { label: "training", value: String(insights.trainingDays) },
                  ].map(({ label, value }) => (
                    <div key={label} className="px-5 py-3.5 flex flex-col gap-0.5">
                      <p className="text-[8px] font-medium tracking-[0.14em] uppercase text-white/20">{label}</p>
                      <p className="text-lg font-semibold tracking-tight text-white/65 font-mono">{value}</p>
                    </div>
                  ))}
                </div>
                {insights.topConstraint && (
                  <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between">
                    <p className="text-[8px] font-medium tracking-[0.14em] uppercase text-white/20">top constraint</p>
                    <p className="text-xs font-mono text-white/38">{insights.topConstraint}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mini Energy Trend */}
          <div className="noise relative w-full rounded-2xl border border-white/[0.08] overflow-hidden" style={panel}>
            <div className="px-5 py-3.5 border-b border-white/[0.06]">
              <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/28">energy trend</p>
            </div>
            <MiniEnergyChart logs={logs} />
          </div>

          {/* Recent Activity */}
          <div className="noise relative w-full rounded-2xl border border-white/[0.08] overflow-hidden" style={panel}>
            <div className="px-5 py-3.5 border-b border-white/[0.06]">
              <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/28">recent activity</p>
            </div>
            {recent.length === 0 ? (
              <div className="px-5 py-5">
                <p className="text-[11px] text-white/18 italic">No recent logs.</p>
              </div>
            ) : (
              <ul className="flex flex-col divide-y divide-white/[0.05]">
                {recent.map((log) => (
                  <li key={log.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <p className="text-[10px] font-medium text-white/45 truncate">{log.input.date} · {log.input.day}</p>
                      <p className="text-[9px] font-mono text-white/22">{log.input.workToday === "yes" ? "Execution" : "Recovery"}</p>
                    </div>
                    <span className="text-xs font-mono text-white/38 shrink-0 ml-3">{log.input.energy}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
