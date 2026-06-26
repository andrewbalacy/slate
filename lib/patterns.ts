import type { SlateLog } from "@/types/logs";

export type Pattern = {
  title: string;
  explanation: string;
  values: { label: string; value: string }[];
};

const MIN_LOGS = 5;

function avg(nums: number[]): number {
  return nums.reduce((s, n) => s + n, 0) / nums.length;
}

function pct(count: number, total: number): string {
  return `${Math.round((count / total) * 100)}%`;
}

function deriveMode(log: SlateLog): string {
  const { energy, cognitiveLoad, workToday } = log.input;
  if (workToday === "no") return "Recovery";
  if (energy <= 4 || (cognitiveLoad === "high" && energy <= 5)) return "Strict Floor";
  if (energy >= 8) return "Deep Work";
  return "Standard Plan";
}

function workEnergyPattern(logs: SlateLog[]): Pattern | null {
  const work = logs.filter(l => l.input.workToday === "yes");
  const off = logs.filter(l => l.input.workToday === "no");
  if (work.length < 2 || off.length < 2) return null;

  const avgWork = avg(work.map(l => l.input.energy));
  const avgOff = avg(off.map(l => l.input.energy));
  const diff = Math.abs(avgWork - avgOff);

  let explanation: string;
  if (diff < 0.5) {
    explanation = "Energy is consistent across work and off days.";
  } else if (avgWork > avgOff) {
    explanation = `Work days carry ${diff.toFixed(1)} points higher avg energy.`;
  } else {
    explanation = `Off days show ${diff.toFixed(1)} points higher avg energy.`;
  }

  return {
    title: "Work day energy split",
    explanation,
    values: [
      { label: "work days", value: avgWork.toFixed(1) },
      { label: "off days", value: avgOff.toFixed(1) },
    ],
  };
}

function trainingEnergyPattern(logs: SlateLog[]): Pattern | null {
  const training = logs.filter(l => l.input.trainingToday === "yes");
  const rest = logs.filter(l => l.input.trainingToday === "no");
  if (training.length < 2 || rest.length < 2) return null;

  const avgT = avg(training.map(l => l.input.energy));
  const avgR = avg(rest.map(l => l.input.energy));
  const diff = Math.abs(avgT - avgR);

  let explanation: string;
  if (diff < 0.5) {
    explanation = "Training shows no significant energy difference.";
  } else if (avgT > avgR) {
    explanation = `Training sessions carry ${diff.toFixed(1)} points higher avg energy.`;
  } else {
    explanation = `Rest days show ${diff.toFixed(1)} points higher avg energy than training days.`;
  }

  return {
    title: "Training day energy",
    explanation,
    values: [
      { label: "training days", value: avgT.toFixed(1) },
      { label: "rest days", value: avgR.toFixed(1) },
    ],
  };
}

function cogLoadPattern(logs: SlateLog[]): Pattern | null {
  if (logs.length < MIN_LOGS) return null;

  const low = logs.filter(l => l.input.cognitiveLoad === "low").length;
  const med = logs.filter(l => l.input.cognitiveLoad === "medium").length;
  const high = logs.filter(l => l.input.cognitiveLoad === "high").length;
  const total = logs.length;

  let explanation: string;
  const highPct = high / total;
  const lowPct = low / total;
  if (highPct >= 0.4) {
    explanation = "Cognitive overhead is frequently elevated.";
  } else if (lowPct >= 0.5) {
    explanation = "Cognitive load is consistently low — capacity headroom available.";
  } else {
    explanation = "Cognitive load is balanced across states.";
  }

  return {
    title: "Cognitive load profile",
    explanation,
    values: [
      { label: "low", value: pct(low, total) },
      { label: "medium", value: pct(med, total) },
      { label: "high", value: pct(high, total) },
    ],
  };
}

function modeDistributionPattern(logs: SlateLog[]): Pattern | null {
  if (logs.length < MIN_LOGS) return null;

  const freq: Record<string, number> = {};
  for (const log of logs) {
    const mode = deriveMode(log);
    freq[mode] = (freq[mode] ?? 0) + 1;
  }

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const [topMode, topCount] = sorted[0];
  const total = logs.length;

  const explanation =
    topMode === "Strict Floor"
      ? `Strict Floor is the dominant mode at ${pct(topCount, total)} of sessions.`
      : topMode === "Deep Work"
      ? `Deep Work occurs ${pct(topCount, total)} of sessions — capacity is available.`
      : topMode === "Recovery"
      ? `Recovery is the most frequent mode at ${pct(topCount, total)} of sessions.`
      : `Standard Plan is the baseline mode at ${pct(topCount, total)} of sessions.`;

  return {
    title: "Operating mode distribution",
    explanation,
    values: sorted.map(([mode, count]) => ({
      label: mode.toLowerCase(),
      value: pct(count, total),
    })),
  };
}

function peakEnergyPattern(logs: SlateLog[]): Pattern | null {
  if (logs.length < MIN_LOGS) return null;

  const high = logs.filter(l => l.input.energy >= 7);
  if (high.length < 2) return null;

  const total = logs.length;
  const workCount = high.filter(l => l.input.workToday === "yes").length;
  const offCount = high.length - workCount;
  const workPct = high.length > 0 ? workCount / high.length : 0;

  let explanation: string;
  if (workPct >= 0.65) {
    explanation = `${pct(high.length, total)} of sessions reach energy ≥7 — primarily on work days.`;
  } else if (workPct <= 0.35) {
    explanation = `${pct(high.length, total)} of sessions reach energy ≥7 — primarily on off days.`;
  } else {
    explanation = `${pct(high.length, total)} of sessions reach energy ≥7, distributed across day types.`;
  }

  return {
    title: "Peak energy conditions",
    explanation,
    values: [
      { label: "sessions ≥7", value: String(high.length) },
      { label: "on work days", value: String(workCount) },
      { label: "on off days", value: String(offCount) },
    ],
  };
}

export function detectPatterns(logs: SlateLog[]): Pattern[] {
  if (logs.length < MIN_LOGS) return [];

  const candidates: (Pattern | null)[] = [
    workEnergyPattern(logs),
    trainingEnergyPattern(logs),
    cogLoadPattern(logs),
    modeDistributionPattern(logs),
    peakEnergyPattern(logs),
  ];

  return candidates.filter((p): p is Pattern => p !== null).slice(0, 3);
}
