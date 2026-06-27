"use client";

import type { CognitiveLoad, YesNo } from "@/types/slate";
import { deriveProtocol } from "@/lib/protocol";

export function derivePreview(energy: number | null, cognitiveLoad: CognitiveLoad | "", workToday: YesNo | "") {
  if (!energy && !cognitiveLoad && !workToday) return null;
  const capacity = energy === null ? "—" : energy >= 8 ? "High" : energy >= 5 ? "Moderate" : "Low";
  const mode = workToday === "yes" ? "Execution" : workToday === "no" ? "Recovery / Build" : "—";
  const recoveryRisk = cognitiveLoad === "high" && energy !== null && energy <= 5 ? "Elevated" : cognitiveLoad && energy !== null ? "Low" : "—";
  const recommendation =
    energy !== null && cognitiveLoad && workToday
      ? deriveProtocol({ date: "", day: "", energy, cognitiveLoad, workToday })
      : "—";
  return { capacity, mode, recoveryRisk, recommendation };
}

export function SystemStatePreview({ energy, cognitiveLoad, workToday }: {
  energy: number | null;
  cognitiveLoad: CognitiveLoad | "";
  workToday: YesNo | "";
}) {
  const state = derivePreview(energy, cognitiveLoad, workToday);
  if (!state) return null;

  const rows = [
    { label: "capacity",       value: state.capacity },
    { label: "mode",           value: state.mode },
    { label: "risk",           value: state.recoveryRisk },
    { label: "recommendation", value: state.recommendation },
  ];

  return (
    <div
      className="rounded-xl border border-white/[0.07] overflow-hidden"
      style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)" }}
    >
      <div className="px-5 py-3 border-b border-white/[0.06]">
        <p className="text-[9px] font-medium tracking-[0.18em] uppercase text-white/22">system state preview</p>
      </div>
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-5 py-2.5">
            <span className="text-[9px] font-medium tracking-[0.14em] uppercase text-white/22">{label}</span>
            <span className="text-xs font-mono text-white/50">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
