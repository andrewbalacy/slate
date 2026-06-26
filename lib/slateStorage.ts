import type { SlateInput, SlatePlan } from "@/types/slate";
import type { SlateLog } from "@/types/logs";

const KEY = "slate_logs";

export function getLogs(): SlateLog[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as SlateLog[];
  } catch {
    return [];
  }
}

function writeLogs(logs: SlateLog[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(logs));
}

export function saveLog(input: SlateInput, plan: SlatePlan): void {
  const entry: SlateLog = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    input,
    plan,
  };
  writeLogs([entry, ...getLogs()]);
}

export function deleteLog(id: string): void {
  writeLogs(getLogs().filter((l) => l.id !== id));
}

export function clearLogs(): void {
  writeLogs([]);
}

export function exportLogs(): string {
  return JSON.stringify(getLogs(), null, 2);
}

export function importLogs(json: string): void {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("Invalid JSON.");
  }
  if (!Array.isArray(parsed)) throw new Error("Expected an array.");
  for (const entry of parsed) {
    if (
      typeof entry !== "object" || entry === null ||
      typeof entry.id !== "string" ||
      typeof entry.timestamp !== "number" ||
      typeof entry.input !== "object" || entry.input === null ||
      typeof entry.plan !== "object" || entry.plan === null
    ) {
      throw new Error("Invalid log entry shape.");
    }
  }
  writeLogs(parsed as SlateLog[]);
}
