import type { SlateInput } from "@/types/slate";

export type Protocol = "Deep Work" | "Standard Plan" | "Strict Floor" | "Recovery";

export function deriveProtocol(input: SlateInput): Protocol {
  const { energy, cognitiveLoad, workToday } = input;
  if (workToday === "no") return "Recovery";
  if (energy <= 4 || (cognitiveLoad === "high" && energy <= 5)) return "Strict Floor";
  if (energy >= 8) return "Deep Work";
  return "Standard Plan";
}
