import type { SlateLog } from "@/types/logs";

export type RecommendationInsights = {
  mostCommon: string;
  distribution: { mode: string; count: number; pct: number }[];
  stability: "Dominant" | "Balanced" | "Varied";
  stabilityExplanation: string;
};

const MIN_LOGS = 5;

const MODES = ["Standard Plan", "Strict Floor", "Recovery", "Deep Work"] as const;

function deriveRecommendation(log: SlateLog): string {
  const { energy, cognitiveLoad, workToday } = log.input;
  if (workToday === "no") return "Recovery";
  if (energy <= 4 || (cognitiveLoad === "high" && energy <= 5)) return "Strict Floor";
  if (energy >= 8) return "Deep Work";
  return "Standard Plan";
}

export function computeRecommendationInsights(
  logs: SlateLog[]
): RecommendationInsights | null {
  if (logs.length < MIN_LOGS) return null;

  const freq: Record<string, number> = Object.fromEntries(MODES.map(m => [m, 0]));
  for (const log of logs) {
    const rec = deriveRecommendation(log);
    freq[rec] = (freq[rec] ?? 0) + 1;
  }

  const total = logs.length;
  const distribution = MODES.map(mode => ({
    mode,
    count: freq[mode],
    pct: Math.round((freq[mode] / total) * 100),
  })).sort((a, b) => b.count - a.count);

  const { mode: mostCommon, pct: topPct } = distribution[0];

  let stability: RecommendationInsights["stability"];
  let stabilityExplanation: string;

  if (topPct >= 60) {
    stability = "Dominant";
    stabilityExplanation = `${mostCommon} accounts for ${topPct}% of sessions. Execution pattern is consistent.`;
  } else if (topPct <= 35) {
    stability = "Varied";
    stabilityExplanation = "No single mode dominates. Recommendations shift significantly across sessions.";
  } else {
    stability = "Balanced";
    stabilityExplanation = `${mostCommon} leads at ${topPct}%, with meaningful spread across other modes.`;
  }

  return { mostCommon, distribution, stability, stabilityExplanation };
}
