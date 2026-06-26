"use client";

import type { CognitiveLoad, YesNo, TrainingToday } from "@/types/slate";
import { EnergySelector } from "./EnergySelector";
import { SegmentedControl } from "./SegmentedControl";
import { SystemStatePreview } from "./SystemStatePreview";
import { RuleExplanation } from "./RuleExplanation";
import { RecommendationProtocol } from "./RecommendationProtocol";

export type DailyFormState = {
  date: string;
  day: string;
  energy: number | null;
  cognitiveLoad: CognitiveLoad | "";
  workToday: YesNo | "";
  constraint: string;
  trainingToday: TrainingToday | "";
};

const labelClass = "text-[10px] font-medium tracking-[0.18em] uppercase text-white/28";
const inputBase  = "slate-input w-full bg-white/[0.03] border border-white/[0.09] rounded-lg px-4 py-2.5 text-sm text-white/90 placeholder:text-white/18 focus:outline-none";

const DAY_OPTIONS = [
  { label: "Mon", value: "monday" },
  { label: "Tue", value: "tuesday" },
  { label: "Wed", value: "wednesday" },
  { label: "Thu", value: "thursday" },
  { label: "Fri", value: "friday" },
  { label: "Sat", value: "saturday" },
  { label: "Sun", value: "sunday" },
];

export function DailyExecutionForm({
  form,
  onChange,
  onGenerate,
}: {
  form: DailyFormState;
  onChange: (updates: Partial<DailyFormState>) => void;
  onGenerate: () => void;
}) {
  return (
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
          onChange={e => onChange({ date: e.target.value })}
          className={inputBase}
        />
      </div>

      {/* day */}
      <div className="px-7 py-5 border-b border-white/[0.06] flex flex-col gap-2">
        <span id="day-label" className={labelClass}>day</span>
        <div role="group" aria-labelledby="day-label" className="flex rounded-lg border border-white/[0.09] overflow-hidden">
          {DAY_OPTIONS.map((opt, i) => {
            const active = form.day === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ day: opt.value })}
                aria-pressed={active}
                className="flex-1 py-2 text-[11px] font-medium tracking-wide transition-all duration-150"
                style={{
                  background: active ? "linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)" : "transparent",
                  color: active ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.25)",
                  borderRight: i < DAY_OPTIONS.length - 1 ? "1px solid rgba(255,255,255,0.09)" : "none",
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
        <EnergySelector
          value={form.energy}
          onChange={v => onChange({ energy: v })}
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
          onChange={v => onChange({ cognitiveLoad: v })}
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
          onChange={v => onChange({ workToday: v })}
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
          onChange={v => onChange({ trainingToday: v })}
        />
      </div>

      {/* constraint */}
      <div className="px-7 py-5 flex flex-col gap-2">
        <label htmlFor="constraint" className={labelClass}>constraint</label>
        <input
          id="constraint" type="text" placeholder="time, focus, health…"
          value={form.constraint}
          onChange={e => onChange({ constraint: e.target.value })}
          className={inputBase}
        />
      </div>

      <div className="px-7 py-5 border-t border-white/[0.06] flex flex-col gap-3">
        <SystemStatePreview
          energy={form.energy}
          cognitiveLoad={form.cognitiveLoad}
          workToday={form.workToday}
        />
        <RuleExplanation
          energy={form.energy}
          cognitiveLoad={form.cognitiveLoad}
          workToday={form.workToday}
          trainingToday={form.trainingToday}
        />
        <RecommendationProtocol
          energy={form.energy}
          cognitiveLoad={form.cognitiveLoad}
          workToday={form.workToday}
        />
      </div>

      <div className="px-7 pb-7 pt-2">
        <button
          type="button"
          onClick={onGenerate}
          className="slate-cmd-btn w-full py-3 rounded-xl text-sm font-medium tracking-wide flex items-center justify-center gap-2"
        >
          <span>Generate Plan</span>
          <span className="text-white/35 font-mono text-xs">→</span>
        </button>
      </div>
    </div>
  );
}
