"use client";

import Link from "next/link";
import { useState } from "react";
import { generateSlatePlan, type SlatePlan, type CognitiveLoad, type YesNo, type TrainingToday, type SlateInput } from "./lib/slateEngine";
import { saveLog } from "@/lib/slateStorage";

// ── primitives ────────────────────────────────────────────────────────────────

const labelClass = "text-[10px] font-medium tracking-[0.18em] uppercase text-white/28";
const inputBase  = "slate-input w-full bg-white/[0.03] border border-white/[0.09] rounded-lg px-4 py-2.5 text-sm text-white/90 placeholder:text-white/18 focus:outline-none";

function SegmentedControl<T extends string>({
  id, options, value, onChange,
}: {
  id: string;
  options: { label: string; value: T }[];
  value: T | "";
  onChange: (v: T) => void;
}) {
  return (
    <div role="group" aria-labelledby={id} className="flex rounded-lg border border-white/[0.09] overflow-hidden">
      {options.map((opt, i) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className="flex-1 py-2.5 text-sm font-medium tracking-wide transition-all duration-150"
            style={{
              background: active
                ? "linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)"
                : "transparent",
              color: active ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.28)",
              borderRight: i < options.length - 1 ? "1px solid rgba(255,255,255,0.09)" : "none",
              boxShadow: active ? "0 1px 0 rgba(255,255,255,0.06) inset" : "none",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function EnergyDots({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const indicator = hovered ?? value;

  return (
    <div className="flex flex-col gap-2">
      <div
        role="group"
        aria-label="Energy level 1 to 10"
        className="flex items-center gap-1.5"
        onMouseLeave={() => setHovered(null)}
      >
        {Array.from({ length: 10 }, (_, i) => {
          const n = i + 1;
          const filled = indicator !== null && n <= indicator;
          const selected = value !== null && n <= value;
          return (
            <button
              key={n}
              type="button"
              aria-label={`Energy ${n}`}
              onClick={() => onChange(n)}
              onMouseEnter={() => setHovered(n)}
              className="relative flex-1 h-2 rounded-full transition-all duration-100"
              style={{
                background: filled
                  ? "rgba(255,255,255,0.7)"
                  : selected
                  ? "rgba(255,255,255,0.45)"
                  : "rgba(255,255,255,0.1)",
                transform: hovered === n ? "scaleY(1.5)" : "scaleY(1)",
                transformOrigin: "center",
              }}
            />
          );
        })}
      </div>
      <div className="flex justify-between px-0.5">
        <span className="text-[8px] font-mono text-white/18">1</span>
        {value !== null && (
          <span className="text-[9px] font-mono text-white/40">{value} / 10</span>
        )}
        <span className="text-[8px] font-mono text-white/18">10</span>
      </div>
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function DailyExecution() {
  const [form, setForm] = useState({
    date: "",
    day: "",
    energy: null as number | null,
    cognitiveLoad: "" as CognitiveLoad | "",
    workToday: "" as YesNo | "",
    constraint: "",
    trainingToday: "" as TrainingToday | "",
  });
  const [plan, setPlan] = useState<SlatePlan | null>(null);
  const [lastInput, setLastInput] = useState<SlateInput | null>(null);
  const [saved, setSaved] = useState(false);

  function handleGenerate() {
    if (!form.date || !form.day || !form.energy || !form.cognitiveLoad || !form.workToday) return;
    const input: SlateInput = {
      date: form.date,
      day: form.day,
      energy: form.energy,
      cognitiveLoad: form.cognitiveLoad as CognitiveLoad,
      workToday: form.workToday as YesNo,
      constraint: form.constraint || undefined,
      trainingToday: (form.trainingToday as TrainingToday) || undefined,
    };
    const result = generateSlatePlan(input);
    setPlan(result);
    setLastInput(input);
    setSaved(false);
  }

  function handleSave() {
    if (!lastInput || !plan) return;
    saveLog(lastInput, plan);
    setSaved(true);
  }

  const dayOptions: { label: string; value: string }[] = [
    { label: "Mon", value: "monday" },
    { label: "Tue", value: "tuesday" },
    { label: "Wed", value: "wednesday" },
    { label: "Thu", value: "thursday" },
    { label: "Fri", value: "friday" },
    { label: "Sat", value: "saturday" },
    { label: "Sun", value: "sunday" },
  ];

  return (
    <main className="relative min-h-screen bg-[#080808] text-white px-6 py-8 flex flex-col overflow-hidden">

      <div aria-hidden className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse 70% 55% at 50% 20%, rgba(255,255,255,0.032) 0%, transparent 70%)",
      }} />

      <Link href="/" className="relative z-10 text-sm font-semibold tracking-tight text-white/40 hover:text-white/70 transition-colors duration-200 w-fit">
        slate.
      </Link>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-14 py-12">

        <div className="flex flex-col items-center text-center gap-3 animate-slide-up">
          <h1 className="text-3xl sm:text-[2.25rem] font-semibold tracking-[-0.02em] text-white/90">
            daily execution
          </h1>
          <p className="text-[10px] font-medium tracking-[0.22em] uppercase text-white/22">
            system configuration
          </p>
        </div>

        <div
          className="noise relative w-full max-w-md rounded-2xl border border-white/[0.08] overflow-hidden animate-slide-up"
          style={{
            background: "linear-gradient(160deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 100%)",
            boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 48px rgba(0,0,0,0.4)",
            animationDelay: "0.05s",
          }}
        >
          {/* date */}
          <div className="px-7 py-5 border-b border-white/[0.06] flex flex-col gap-2">
            <label htmlFor="date" className={labelClass}>date</label>
            <input
              id="date" type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className={inputBase}
            />
          </div>

          {/* day */}
          <div className="px-7 py-5 border-b border-white/[0.06] flex flex-col gap-2">
            <span id="day-label" className={labelClass}>day</span>
            <div role="group" aria-labelledby="day-label" className="flex rounded-lg border border-white/[0.09] overflow-hidden">
              {dayOptions.map((opt, i) => {
                const active = form.day === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, day: opt.value }))}
                    aria-pressed={active}
                    className="flex-1 py-2 text-[11px] font-medium tracking-wide transition-all duration-150"
                    style={{
                      background: active ? "linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)" : "transparent",
                      color: active ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.25)",
                      borderRight: i < dayOptions.length - 1 ? "1px solid rgba(255,255,255,0.09)" : "none",
                      boxShadow: active ? "0 1px 0 rgba(255,255,255,0.06) inset" : "none",
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* energy */}
          <div className="px-7 py-5 border-b border-white/[0.06] flex flex-col gap-2">
            <span className={labelClass}>energy</span>
            <EnergyDots
              value={form.energy}
              onChange={v => setForm(f => ({ ...f, energy: v }))}
            />
          </div>

          {/* cognitive load */}
          <div className="px-7 py-5 border-b border-white/[0.06] flex flex-col gap-2">
            <span id="cog-label" className={labelClass}>cognitive load</span>
            <SegmentedControl<CognitiveLoad>
              id="cog-label"
              options={[
                { label: "Low",    value: "low" },
                { label: "Medium", value: "medium" },
                { label: "High",   value: "high" },
              ]}
              value={form.cognitiveLoad}
              onChange={v => setForm(f => ({ ...f, cognitiveLoad: v }))}
            />
          </div>

          {/* work today */}
          <div className="px-7 py-5 border-b border-white/[0.06] flex flex-col gap-2">
            <span id="work-label" className={labelClass}>work today</span>
            <SegmentedControl<YesNo>
              id="work-label"
              options={[
                { label: "Yes", value: "yes" },
                { label: "No",  value: "no" },
              ]}
              value={form.workToday}
              onChange={v => setForm(f => ({ ...f, workToday: v }))}
            />
          </div>

          {/* training today */}
          <div className="px-7 py-5 border-b border-white/[0.06] flex flex-col gap-2">
            <span id="train-label" className={labelClass}>training today</span>
            <SegmentedControl<TrainingToday>
              id="train-label"
              options={[
                { label: "Yes",  value: "yes" },
                { label: "No",   value: "no" },
                { label: "Auto", value: "auto" },
              ]}
              value={form.trainingToday}
              onChange={v => setForm(f => ({ ...f, trainingToday: v }))}
            />
          </div>

          {/* constraint */}
          <div className="px-7 py-5 flex flex-col gap-2">
            <label htmlFor="constraint" className={labelClass}>constraint</label>
            <input
              id="constraint" type="text" placeholder="time, focus, health…"
              value={form.constraint}
              onChange={e => setForm(f => ({ ...f, constraint: e.target.value }))}
              className={inputBase}
            />
          </div>

          <div className="px-7 pb-7 pt-2">
            <button
              type="button"
              onClick={handleGenerate}
              className="slate-cmd-btn w-full py-3 rounded-xl text-sm font-medium tracking-wide flex items-center justify-center gap-2"
            >
              <span>Generate Plan</span>
              <span className="text-white/35 font-mono text-xs">→</span>
            </button>
          </div>
        </div>

        {/* Output card */}
        {plan && (
          <div key={plan.title + plan.closingLine} className="w-full max-w-md flex flex-col gap-3 animate-fade-in">
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/22 px-1">
              generated plan
            </p>
            <div
              className="noise relative rounded-2xl border border-white/[0.08] overflow-hidden"
              style={{
                background: "linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.012) 100%)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 48px rgba(0,0,0,0.4)",
              }}
            >
              <div className="px-8 py-7 border-b border-white/[0.07]"
                style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 100%)" }}>
                <p className="text-2xl font-semibold tracking-tight text-white/90">{plan.title}</p>
              </div>
              <ul className="flex flex-col divide-y divide-white/[0.05]">
                {plan.blocks.map((block, i) => (
                  <li key={i} className="px-8 py-4 text-sm text-white/55 font-mono tracking-wide animate-fade-in"
                    style={{ animationDelay: `${i * 0.06 + 0.1}s` }}>
                    {block}
                  </li>
                ))}
              </ul>
              <div className="px-8 py-5 border-t border-white/[0.07]">
                <p className="text-xs text-white/22 tracking-[0.06em]">{plan.closingLine}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saved}
              className="w-full py-3 border border-white/[0.09] rounded-xl text-sm font-medium tracking-wide transition-all duration-150 disabled:cursor-default"
              style={{
                color: saved ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.5)",
                background: saved ? "rgba(255,255,255,0.02)" : "transparent",
              }}
            >
              {saved ? "log saved" : "save today's log"}
            </button>
          </div>
        )}

        <Link href="/" className="text-xs text-white/22 hover:text-white/50 transition-colors duration-200 tracking-wide">
          ← back
        </Link>
      </div>
    </main>
  );
}
