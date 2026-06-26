import type { SlateLog } from "@/types/logs";

export type HealthScore = {
  score: number;
  label: string;
  explanation: string;
  factors: string[];
};

const MIN_LOGS = 3;

function avgEnergy(logs: SlateLog[]): number {
  return logs.reduce((s, l) => s + l.input.energy, 0) / logs.length;
}

function distinctDaysInLastWeek(logs: SlateLog[]): number {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const days = new Set<string>();
  for (const l of logs) {
    if (l.timestamp >= cutoff) days.add(new Date(l.timestamp).toDateString());
  }
  return days.size;
}

function elevatedRiskRate(logs: SlateLog[]): number {
  const count = logs.filter(
    l => l.input.cognitiveLoad === "high" && l.input.energy <= 5
  ).length;
  return count / logs.length;
}

function toLabel(score: number): string {
  if (score >= 80) return "Optimal";
  if (score >= 65) return "Stable";
  if (score >= 45) return "Moderate";
  if (score >= 25) return "Strained";
  return "Degraded";
}

function toExplanation(score: number): string {
  if (score >= 80) return "System executing within healthy parameters.";
  if (score >= 65) return "Execution stable. Monitor for fatigue accumulation.";
  if (score >= 45) return "Moderate strain detected. Consider reducing load.";
  return "Recovery deficit detected. Prioritize rest over output.";
}

export function computeHealthScore(logs: SlateLog[]): HealthScore | null {
  if (logs.length < MIN_LOGS) return null;

  const recent = logs.slice(0, 7);

  const avg = avgEnergy(recent);
  const energyPts = Math.round((avg / 10) * 40);

  const daysLogged = distinctDaysInLastWeek(logs);
  const consistencyPts = Math.round((daysLogged / 7) * 30);

  const riskRate = elevatedRiskRate(recent);
  const recoveryPts = Math.round((1 - riskRate) * 30);

  const score = Math.min(100, energyPts + consistencyPts + recoveryPts);

  const factors: string[] = [];

  if (avg >= 7) {
    factors.push(`Avg energy ${avg.toFixed(1)} — healthy range`);
  } else if (avg >= 5) {
    factors.push(`Avg energy ${avg.toFixed(1)} — moderate`);
  } else {
    factors.push(`Avg energy ${avg.toFixed(1)} — below threshold`);
  }

  factors.push(`${daysLogged} of last 7 days logged`);

  const riskCount = Math.round(riskRate * recent.length);
  if (riskRate === 0) {
    factors.push("No recovery risk indicators");
  } else if (riskRate <= 0.3) {
    factors.push(`Recovery risk low — ${riskCount} flagged session${riskCount !== 1 ? "s" : ""}`);
  } else {
    factors.push(`Elevated risk in ${riskCount} of ${recent.length} sessions`);
  }

  return {
    score,
    label: toLabel(score),
    explanation: toExplanation(score),
    factors,
  };
}
