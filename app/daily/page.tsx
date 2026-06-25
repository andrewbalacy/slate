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

  const inputClass = "bg-transparent border border-white/10 rounded-md px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors duration-150";
  const labelClass = "text-xs font-medium tracking-widest uppercase text-white/30";
  const selectClass = `${inputClass} appearance-none`;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8 flex flex-col">
      <Link href="/" className="text-sm font-semibold tracking-tight text-white/60 hover:text-white transition-colors duration-150 w-fit">
        slate.
      </Link>

      <div className="flex-1 flex flex-col items-center justify-center gap-14 py-12">
        <div className="flex flex-col items-center text-center gap-4">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            daily execution
          </h1>
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/30">
            inputs → rules → output
          </p>
        </div>

        <div className="w-full max-w-md border border-white/10 rounded-xl px-8 py-10 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="date" className={labelClass}>date</label>
            <input id="date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="day" className={labelClass}>day</label>
            <input id="day" type="text" placeholder="monday" value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))} className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="energy" className={labelClass}>energy</label>
            <input id="energy" type="number" min={1} max={10} placeholder="1 – 10" value={form.energy} onChange={e => setForm(f => ({ ...f, energy: e.target.value }))} className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="cognitiveLoad" className={labelClass}>cognitive load</label>
            <select id="cognitiveLoad" value={form.cognitiveLoad} onChange={e => setForm(f => ({ ...f, cognitiveLoad: e.target.value as CognitiveLoad }))} className={selectClass}>
              <option value="" disabled className="bg-black">select</option>
              <option value="low" className="bg-black">low</option>
              <option value="medium" className="bg-black">medium</option>
              <option value="high" className="bg-black">high</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="workToday" className={labelClass}>work today</label>
            <select id="workToday" value={form.workToday} onChange={e => setForm(f => ({ ...f, workToday: e.target.value as YesNo }))} className={selectClass}>
              <option value="" disabled className="bg-black">select</option>
              <option value="yes" className="bg-black">yes</option>
              <option value="no" className="bg-black">no</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="constraint" className={labelClass}>constraint</label>
            <input id="constraint" type="text" placeholder="time, focus, health…" value={form.constraint} onChange={e => setForm(f => ({ ...f, constraint: e.target.value }))} className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="trainingToday" className={labelClass}>training today</label>
            <select id="trainingToday" value={form.trainingToday} onChange={e => setForm(f => ({ ...f, trainingToday: e.target.value as TrainingToday }))} className={selectClass}>
              <option value="" className="bg-black">auto</option>
              <option value="yes" className="bg-black">yes</option>
              <option value="no" className="bg-black">no</option>
              <option value="auto" className="bg-black">auto</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            className="mt-4 w-full py-3 bg-white text-black text-sm font-medium tracking-wide rounded-md hover:bg-white/90 transition-colors duration-150"
          >
            Generate Plan
          </button>
        </div>

        {plan && (
          <div className="w-full max-w-md border border-white/10 rounded-xl px-8 py-10 flex flex-col gap-6">
            <p className="text-base font-semibold tracking-tight text-white">{plan.title}</p>
            <ul className="flex flex-col gap-3">
              {plan.blocks.map((block, i) => (
                <li key={i} className="text-sm text-white/70">{block}</li>
              ))}
            </ul>
            <p className="text-xs text-white/30 border-t border-white/10 pt-4">{plan.closingLine}</p>
          </div>
        )}

        <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors duration-150 tracking-wide">
          ← back
        </Link>
      </div>
    </main>
  );
}
