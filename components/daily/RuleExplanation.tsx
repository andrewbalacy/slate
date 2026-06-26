"use client";

import type { CognitiveLoad, YesNo, TrainingToday } from "@/types/slate";

export function buildRuleExplanation(
  energy: number | null,
  cognitiveLoad: CognitiveLoad | "",
  workToday: YesNo | "",
  trainingToday: TrainingToday | "",
): string[] | null {
  if (energy === null && !cognitiveLoad && !workToday) return null;
  const rules: string[] = [];

  if (energy !== null) {
    if (energy <= 4)       rules.push(`energy ${energy}/10 — low capacity floor enforced`);
    else if (energy <= 6)  rules.push(`energy ${energy}/10 — moderate output ceiling`);
    else if (energy <= 7)  rules.push(`energy ${energy}/10 — standard execution range`);
    else                   rules.push(`energy ${energy}/10 — high capacity unlocked`);
  }

  if (workToday === "yes") rules.push("work day detected — execution mode active");
  if (workToday === "no")  rules.push("off day — recovery and build mode");

  if (cognitiveLoad === "high")   rules.push("high cognitive load — overhead minimized");
  if (cognitiveLoad === "medium") rules.push("medium cognitive load — standard plan applies");
  if (cognitiveLoad === "low")    rules.push("low cognitive load — expansion possible");

  if (workToday === "yes" && cognitiveLoad === "high" && energy !== null && energy <= 5)
    rules.push("strict floor triggered — single growth block only");

  if (trainingToday === "yes") rules.push("training enabled — movement block included");
  if (trainingToday === "no")  rules.push("training suppressed — rest day");
  if (trainingToday === "auto" || trainingToday === "") {
    if (energy !== null && energy >= 7) rules.push("auto training — aerobic block eligible");
    else if (energy !== null && energy >= 5) rules.push("auto training — light movement eligible");
  }

  return rules.length ? rules : null;
}

export function RuleExplanation({ energy, cognitiveLoad, workToday, trainingToday }: {
  energy: number | null;
  cognitiveLoad: CognitiveLoad | "";
  workToday: YesNo | "";
  trainingToday: TrainingToday | "";
}) {
  const rules = buildRuleExplanation(energy, cognitiveLoad, workToday, trainingToday);
  if (!rules) return null;

  return (
    <div
      className="rounded-xl border border-white/[0.06] overflow-hidden"
      style={{ background: "rgba(255,255,255,0.012)" }}
    >
      <div className="px-5 py-3 border-b border-white/[0.05]">
        <p className="text-[9px] font-medium tracking-[0.18em] uppercase text-white/18">rule explanation</p>
      </div>
      <ul className="flex flex-col gap-0 divide-y divide-white/[0.04]">
        {rules.map((rule, i) => (
          <li key={i} className="flex items-start gap-2.5 px-5 py-2.5">
            <span className="text-white/15 font-mono text-[9px] mt-px shrink-0">—</span>
            <span className="text-[11px] text-white/35 leading-relaxed">{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
