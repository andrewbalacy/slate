import type { SlateLog } from "@/types/logs";

export type RecoveryTrend = {
  direction: "Increasing" | "Stable" | "Decreasing";
  level: "Low" | "Moderate" | "Elevated";
  explanation: string;
  factors: string[];
};

const MIN_LOGS = 5;
const WINDOW = 7;

function avg(nums: number[]): number {
  return nums.reduce((s, n) => s + n, 0) / nums.length;
}

function isDemanding(log: SlateLog): boolean {
  return log.input.cognitiveLoad === "high" || log.input.energy <= 5;
}

export function computeRecoveryTrend(logs: SlateLog[]): RecoveryTrend | null {
  if (logs.length < MIN_LOGS) return null;

  // logs[0] is most recent (localStorage prepend order)
  const window = logs.slice(0, WINDOW);
  const n = window.length;

  const lowEnergy = window.filter(l => l.input.energy <= 5);
  const highCog = window.filter(l => l.input.cognitiveLoad === "high");
  const elevated = window.filter(
    l => l.input.energy <= 5 && l.input.cognitiveLoad === "high"
  );
  const workDays = window.filter(l => l.input.workToday === "yes");

  // Risk level based on frequency within window
  let level: RecoveryTrend["level"];
  if (elevated.length >= Math.ceil(n / 2) || lowEnergy.length >= Math.ceil(n / 2)) {
    level = "Elevated";
  } else if (elevated.length >= 1 || lowEnergy.length + highCog.length >= Math.ceil(n / 3)) {
    level = "Moderate";
  } else {
    level = "Low";
  }

  // Trend direction: compare energy avg of newest 3 vs prior 3 (requires ≥6 logs)
  let direction: RecoveryTrend["direction"] = "Stable";
  if (n >= 6) {
    const recentAvg = avg(window.slice(0, 3).map(l => l.input.energy));
    const priorAvg = avg(window.slice(3, 6).map(l => l.input.energy));
    // Energy falling → recovery risk rising
    if (priorAvg - recentAvg >= 1.0) direction = "Increasing";
    else if (recentAvg - priorAvg >= 1.0) direction = "Decreasing";
  }

  // Consecutive demanding sessions from most recent backward
  let consecutiveDemanding = 0;
  for (const l of window) {
    if (isDemanding(l)) consecutiveDemanding++;
    else break;
  }

  const explanation =
    direction === "Increasing"
      ? "Energy declining across recent sessions. Recovery gap may be forming."
      : direction === "Decreasing"
      ? "Energy improving across recent sessions. Recovery is effective."
      : level === "Elevated"
      ? "Risk is elevated but holding steady. Monitor for further decline."
      : level === "Moderate"
      ? "Moderate indicators present. No clear escalation detected."
      : "Recovery risk is low and stable across recent sessions.";

  const factors: string[] = [
    `Low energy sessions: ${lowEnergy.length} of ${n}`,
    `High cognitive load: ${highCog.length} of ${n}`,
    consecutiveDemanding >= 2
      ? `${consecutiveDemanding} consecutive demanding sessions`
      : `Work day density: ${workDays.length} of ${n}`,
  ];

  return { direction, level, explanation, factors };
}
