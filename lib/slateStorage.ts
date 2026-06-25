import type { SlateInput, SlatePlan } from "@/app/daily/lib/slateEngine";

export type SlateLog = {
  id: string;
  timestamp: number;
  input: SlateInput;
  plan: SlatePlan;
};

const KEY = "slate_logs";

export function getLogs(): SlateLog[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as SlateLog[];
  } catch {
    return [];
  }
}

export function saveLog(input: SlateInput, plan: SlatePlan): void {
  const logs = getLogs();
  const entry: SlateLog = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    input,
    plan,
  };
  localStorage.setItem(KEY, JSON.stringify([entry, ...logs]));
}
