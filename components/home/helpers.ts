import type { SlateLog } from "@/types/logs";

export const panel = {
  background: "linear-gradient(160deg, rgba(255,255,255,0.033) 0%, rgba(255,255,255,0.013) 100%)",
  boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 24px rgba(0,0,0,0.4)",
};

export function deriveSystemState(log: SlateLog) {
  const { energy, cognitiveLoad, workToday } = log.input;
  const capacity = energy >= 8 ? "High" : energy >= 5 ? "Moderate" : "Low";
  const mode = workToday === "yes" ? "Execution" : "Recovery / Build";
  const recoveryRisk = cognitiveLoad === "high" && energy <= 5 ? "Elevated" : "Low";
  const recommendation =
    workToday === "no" ? "Recovery"
    : energy <= 4 || recoveryRisk === "Elevated" ? "Strict Floor"
    : energy >= 8 ? "Deep Work"
    : "Standard Plan";
  return { energy, capacity, mode, recoveryRisk, recommendation };
}

export function computeInsights(logs: SlateLog[]) {
  if (!logs.length) return null;
  const avgEnergy = logs.reduce((s, l) => s + l.input.energy, 0) / logs.length;
  const workDays = logs.filter(l => l.input.workToday === "yes").length;
  const trainingDays = logs.filter(l => l.input.trainingToday === "yes").length;
  const freq: Record<string, number> = {};
  for (const l of logs) if (l.input.constraint) freq[l.input.constraint] = (freq[l.input.constraint] ?? 0) + 1;
  const topConstraint = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  return { total: logs.length, avgEnergy, workDays, trainingDays, topConstraint };
}
