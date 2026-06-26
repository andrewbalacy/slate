"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLogs } from "@/lib/slateStorage";
import type { SlateLog } from "@/types/logs";

function EnergyTrend({ logs }: { logs: SlateLog[] }) {
  const recent = [...logs].reverse().slice(0, 7);

  if (recent.length < 2) {
    return (
      <p className="px-6 py-6 text-xs text-white/18 italic">
        More logs needed to generate a trend.
      </p>
    );
  }

  const W = 320;
  const H = 80;
  const PAD_X = 0;
  const PAD_Y = 6;
  const plotW = W - PAD_X * 2;
  const plotH = H - PAD_Y * 2;

  const points = recent.map((l, i) => {
    const x = PAD_X + (i / (recent.length - 1)) * plotW;
    const y = PAD_Y + plotH - ((l.input.energy - 1) / 9) * plotH;
    return { x, y, energy: l.input.energy, date: l.input.date };
  });

  const polyline = points.map(p => `${p.x},${p.y}`).join(" ");
  const area = [
    `M ${points[0].x},${H}`,
    ...points.map(p => `L ${p.x},${p.y}`),
    `L ${points[points.length - 1].x},${H}`,
    "Z",
  ].join(" ");

  return (
    <div className="px-6 pb-6 pt-2">
      {/* Y-axis hints */}
      <div className="flex justify-between mb-1.5 px-0.5">
        {[10, 7, 4, 1].map(v => (
          <span key={v} className="text-[8px] font-mono text-white/14 w-3">{v}</span>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: 80 }}
        preserveAspectRatio="none"
      >
        {/* Horizontal grid lines */}
        {[1, 4, 7, 10].map(v => {
          const y = PAD_Y + plotH - ((v - 1) / 9) * plotH;
          return (
            <line key={v} x1={0} y1={y} x2={W} y2={y}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          );
        })}

        {/* Area fill */}
        <path d={area} fill="rgba(255,255,255,0.03)" />

        {/* Line */}
        <polyline
          points={polyline}
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5"
            fill="#080808" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
        ))}
      </svg>

      {/* Date labels */}
      <div className="flex justify-between mt-2 px-0.5">
        {points.map((p, i) => {
          const parts = p.date.split("-");
          const label = parts.length === 3 ? `${parts[1]}/${parts[2]}` : p.date;
          return (
            <span key={i} className="text-[8px] font-mono text-white/18 text-center"
              style={{ width: `${100 / points.length}%` }}>
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function computeReview(logs: SlateLog[]) {
  if (!logs.length) return null;

  const avgEnergy = logs.reduce((s, l) => s + l.input.energy, 0) / logs.length;
  const workDays = logs.filter(l => l.input.workToday === "yes").length;
  const trainingDays = logs.filter(l => l.input.trainingToday === "yes").length;

  const constraints = logs.map(l => l.input.constraint).filter(Boolean) as string[];
  const freq: Record<string, number> = {};
  for (const c of constraints) freq[c] = (freq[c] ?? 0) + 1;
  const topConstraint = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return { avgEnergy, workDays, trainingDays, topConstraint };
}

export default function Logs() {
  const [logs, setLogs] = useState<SlateLog[]>([]);

  useEffect(() => {
    setLogs(getLogs());
  }, []);

  const review = computeReview(logs);

  const panelStyle = {
    background: "linear-gradient(160deg, rgba(255,255,255,0.033) 0%, rgba(255,255,255,0.013) 100%)",
    boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 48px rgba(0,0,0,0.4)",
  };

  return (
    <main className="relative min-h-screen bg-[#080808] text-white px-6 py-8 flex flex-col overflow-hidden">

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

      <div className="relative z-10 flex-1 flex flex-col items-center gap-12 py-12 max-w-md mx-auto w-full">

        <div className="flex flex-col items-center text-center gap-3 animate-slide-up w-full">
          <h1 className="text-3xl sm:text-[2.25rem] font-semibold tracking-[-0.02em] text-white/90">
            logs
          </h1>
          <p className="text-[10px] font-medium tracking-[0.22em] uppercase text-white/22">
            execution memory
          </p>
        </div>

        {/* Weekly review panel */}
        {review && (
          <div
            className="noise relative w-full rounded-2xl border border-white/[0.08] overflow-hidden animate-slide-up"
            style={{ ...panelStyle, animationDelay: "0.05s" }}
          >
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/28">
                weekly review
              </p>
            </div>
            <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.05]">
              {[
                { label: "logged days",       value: String(logs.length) },
                { label: "avg energy",        value: review.avgEnergy.toFixed(1) },
                { label: "work days",         value: String(review.workDays) },
                { label: "training days",     value: String(review.trainingDays) },
              ].map(({ label, value }) => (
                <div key={label} className="px-6 py-4 flex flex-col gap-1">
                  <p className="text-[9px] font-medium tracking-[0.16em] uppercase text-white/22">{label}</p>
                  <p className="text-xl font-semibold tracking-tight text-white/75 font-mono">{value}</p>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between">
              <p className="text-[9px] font-medium tracking-[0.16em] uppercase text-white/22">top constraint</p>
              <p className="text-xs font-mono text-white/45">{review.topConstraint}</p>
            </div>
          </div>
        )}

        {/* Energy Trend */}
        <div
          className="noise relative w-full rounded-2xl border border-white/[0.08] overflow-hidden animate-slide-up"
          style={{ ...panelStyle, animationDelay: "0.08s" }}
        >
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/28">
              energy trend
            </p>
          </div>
          <EnergyTrend logs={logs} />
        </div>

        {/* Log entries */}
        <div className="w-full flex flex-col gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {logs.length === 0 && (
            <div
              className="w-full rounded-2xl border border-white/[0.08] px-8 py-10 flex items-center justify-center"
              style={panelStyle}
            >
              <p className="text-sm text-white/18 italic">no logs yet.</p>
            </div>
          )}

          {logs.map((log) => {
            const d = new Date(log.timestamp);
            const ts = d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })
              + " · " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            return (
              <div
                key={log.id}
                className="noise relative w-full rounded-2xl border border-white/[0.08] overflow-hidden"
                style={panelStyle}
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                  <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/28">
                    {log.input.date} · {log.input.day}
                  </p>
                  <p className="text-[9px] font-mono text-white/18">{ts}</p>
                </div>

                {/* Input summary */}
                <div className="px-6 py-4 flex flex-col gap-2 border-b border-white/[0.06]">
                  {[
                    { label: "energy",        value: String(log.input.energy) },
                    { label: "cognitive load", value: log.input.cognitiveLoad },
                    { label: "work today",    value: log.input.workToday },
                    { label: "training",      value: log.input.trainingToday ?? "auto" },
                    ...(log.input.constraint ? [{ label: "constraint", value: log.input.constraint }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-white/28 tracking-wide">{label}</span>
                      <span className="text-xs font-mono text-white/50">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Plan summary */}
                <div className="px-6 py-4">
                  <p className="text-[9px] font-medium tracking-[0.16em] uppercase text-white/20 mb-3">
                    generated plan
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {log.plan.blocks.map((block, i) => (
                      <li key={i} className="text-xs font-mono text-white/40 truncate">{block}</li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-white/18 mt-3 tracking-wide">{log.plan.closingLine}</p>
                </div>
              </div>
            );
          })}
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
