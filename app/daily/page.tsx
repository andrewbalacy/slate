"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { generateSlatePlan } from "@/lib/slateEngine";
import type { SlatePlan, CognitiveLoad, YesNo, TrainingToday, SlateInput } from "@/types/slate";
import { saveLog } from "@/lib/slateStorage";
import { useToast } from "@/components/shell/ToastProvider";
import { DailyExecutionForm, type DailyFormState } from "@/components/daily/DailyExecutionForm";
import { GeneratedPlan } from "@/components/daily/GeneratedPlan";

export default function DailyExecution() {
  const [form, setForm] = useState<DailyFormState>({
    date: "",
    day: "",
    energy: null,
    cognitiveLoad: "",
    workToday: "",
    constraint: "",
    trainingToday: "",
  });

  useEffect(() => {
    const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const dayStr = days[now.getDay()];
    setForm(f => ({
      ...f,
      date: f.date || dateStr,
      day: f.day || dayStr,
    }));
  }, []);

  const { toast } = useToast();
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
    toast("Plan generated.");
  }

  function handleSave() {
    if (!lastInput || !plan) return;
    saveLog(lastInput, plan);
    setSaved(true);
    toast("Execution memory updated.");
  }

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

        <DailyExecutionForm
          form={form}
          onChange={updates => setForm(f => ({ ...f, ...updates }))}
          onGenerate={handleGenerate}
        />

        {plan && lastInput && (
          <GeneratedPlan
            key={plan.title + plan.closingLine}
            plan={plan}
            input={lastInput}
            saved={saved}
            onSave={handleSave}
          />
        )}

        <Link href="/" className="text-xs text-white/22 hover:text-white/50 transition-colors duration-200 tracking-wide">
          ← back
        </Link>
      </div>
    </main>
  );
}
