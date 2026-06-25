"use client";

import Link from "next/link";
import { useState } from "react";
import { generateSlatePlan, type SlatePlan, type CognitiveLoad, type YesNo, type TrainingToday } from "./lib/slateEngine";

export default function DailyExecution() {
  const [form, setForm] = useState({
    date: "",
    day: "",
    energy: "",
    cognitiveLoad: "" as CognitiveLoad | "",
    workToday: "" as YesNo | "",
    constraint: "",
    trainingToday: "" as TrainingToday | "",
  });
  const [plan, setPlan] = useState<SlatePlan | null>(null);

  function handleGenerate() {
    if (!form.date || !form.day || !form.energy || !form.cognitiveLoad || !form.workToday) return;
    const result = generateSlatePlan({
      date: form.date,
      day: form.day,
      energy: Number(form.energy),
      cognitiveLoad: form.cognitiveLoad as CognitiveLoad,
      workToday: form.workToday as YesNo,
      constraint: form.constraint || undefined,
      trainingToday: (form.trainingToday as TrainingToday) || undefined,
    });
    setPlan(result);
  }

  const inputBase =
    "slate-input w-full bg-white/[0.03] border border-white/[0.09] rounded-lg px-4 py-2.5 text-sm text-white/90 placeholder:text-white/18 focus:outline-none";
  const labelClass =
    "text-[10px] font-medium tracking-[0.18em] uppercase text-white/28";
  const selectBase = `${inputBase} appearance-none cursor-pointer`;

  return (
    <main className="relative min-h-screen bg-[#080808] text-white px-6 py-8 flex flex-col overflow-hidden">

      {/* Ambient radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 20%, rgba(255,255,255,0.032) 0%, transparent 70%)",
        }}
      />

      {/* Top nav */}
      <Link
        href="/"
        className="relative z-10 text-sm font-semibold tracking-tight text-white/40 hover:text-white/70 transition-colors duration-200 w-fit"
      >
        slate.
      </Link>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-14 py-12">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3 animate-slide-up">
          <h1 className="text-3xl sm:text-[2.25rem] font-semibold tracking-[-0.02em] text-white/90">
            daily execution
          </h1>
          <p className="text-[10px] font-medium tracking-[0.22em] uppercase text-white/22">
            inputs → rules → output
          </p>
        </div>

        {/* Input card */}
        <div
          className="noise relative w-full max-w-md rounded-2xl border border-white/[0.08] px-8 py-10 flex flex-col gap-5 animate-slide-up"
          style={{
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 100%)",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 48px rgba(0,0,0,0.4)",
            animationDelay: "0.05s",
          }}
        >
          {/* date */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="date" className={labelClass}>date</label>
            <input
              id="date" type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className={inputBase}
            />
          </div>

          {/* day */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="day" className={labelClass}>day</label>
            <input
              id="day" type="text" placeholder="monday"
              value={form.day}
              onChange={e => setForm(f => ({ ...f, day: e.target.value }))}
              className={inputBase}
            />
          </div>

          {/* energy */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="energy" className={labelClass}>energy</label>
            <input
              id="energy" type="number" min={1} max={10} placeholder="1 – 10"
              value={form.energy}
              onChange={e => setForm(f => ({ ...f, energy: e.target.value }))}
              className={inputBase}
            />
          </div>

          {/* cognitive load */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cognitiveLoad" className={labelClass}>cognitive load</label>
            <select
              id="cognitiveLoad"
              value={form.cognitiveLoad}
              onChange={e => setForm(f => ({ ...f, cognitiveLoad: e.target.value as CognitiveLoad }))}
              className={selectBase}
            >
              <option value="" disabled className="bg-[#0e0e0e]">select</option>
              <option value="low" className="bg-[#0e0e0e]">low</option>
              <option value="medium" className="bg-[#0e0e0e]">medium</option>
              <option value="high" className="bg-[#0e0e0e]">high</option>
            </select>
          </div>

          {/* work today */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="workToday" className={labelClass}>work today</label>
            <select
              id="workToday"
              value={form.workToday}
              onChange={e => setForm(f => ({ ...f, workToday: e.target.value as YesNo }))}
              className={selectBase}
            >
              <option value="" disabled className="bg-[#0e0e0e]">select</option>
              <option value="yes" className="bg-[#0e0e0e]">yes</option>
              <option value="no" className="bg-[#0e0e0e]">no</option>
            </select>
          </div>

          {/* constraint */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="constraint" className={labelClass}>constraint</label>
            <input
              id="constraint" type="text" placeholder="time, focus, health…"
              value={form.constraint}
              onChange={e => setForm(f => ({ ...f, constraint: e.target.value }))}
              className={inputBase}
            />
          </div>

          {/* training today */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="trainingToday" className={labelClass}>training today</label>
            <select
              id="trainingToday"
              value={form.trainingToday}
              onChange={e => setForm(f => ({ ...f, trainingToday: e.target.value as TrainingToday }))}
              className={selectBase}
            >
              <option value="" className="bg-[#0e0e0e]">auto</option>
              <option value="yes" className="bg-[#0e0e0e]">yes</option>
              <option value="no" className="bg-[#0e0e0e]">no</option>
              <option value="auto" className="bg-[#0e0e0e]">auto</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            className="mt-3 w-full py-3 bg-white text-black text-sm font-medium tracking-wide rounded-lg hover:bg-white/92 active:bg-white/80 transition-all duration-150"
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            Generate Plan
          </button>
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
                background:
                  "linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.012) 100%)",
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 48px rgba(0,0,0,0.4)",
              }}
            >
              {/* Title row */}
              <div className="px-8 py-7 border-b border-white/[0.07]"
                style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 100%)" }}
              >
                <p className="text-2xl font-semibold tracking-tight text-white/90">{plan.title}</p>
              </div>

              {/* Blocks */}
              <ul className="flex flex-col divide-y divide-white/[0.05]">
                {plan.blocks.map((block, i) => (
                  <li
                    key={i}
                    className="px-8 py-4 text-sm text-white/55 font-mono tracking-wide animate-fade-in"
                    style={{ animationDelay: `${i * 0.06 + 0.1}s` }}
                  >
                    {block}
                  </li>
                ))}
              </ul>

              {/* Closing line */}
              <div className="px-8 py-5 border-t border-white/[0.07]">
                <p className="text-xs text-white/22 tracking-[0.06em]">{plan.closingLine}</p>
              </div>
            </div>
          </div>
        )}

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
