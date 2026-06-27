import type { SlateInput } from "@/types/slate";
import { deriveProtocol, type Protocol } from "@/lib/protocol";

export type InspectData = {
  limitingFactor: { label: string; explanation: string } | null;
  positiveSignals: string[];
  constraints: string[];
  tradeoff: {
    current: { probability: number; recoveryRisk: string };
    everything: { probability: number; recoveryRisk: string };
  };
  optimizationPriorities: string[];
  confidence: number;
  adaptiveOpportunity: string | null;
  tomorrowProjection: { recoveryRisk: string; projectedCapacity: number; explanation: string };
};


const TRADEOFF: Record<Protocol, { current: { probability: number; recoveryRisk: string }; everything: { probability: number; recoveryRisk: string } }> = {
  "Deep Work":     { current: { probability: 91, recoveryRisk: "Low" }, everything: { probability: 52, recoveryRisk: "Moderate" } },
  "Standard Plan": { current: { probability: 84, recoveryRisk: "Low" }, everything: { probability: 47, recoveryRisk: "High" } },
  "Strict Floor":  { current: { probability: 93, recoveryRisk: "Low" }, everything: { probability: 38, recoveryRisk: "High" } },
  "Recovery":      { current: { probability: 88, recoveryRisk: "Low" }, everything: { probability: 51, recoveryRisk: "Moderate" } },
};

type TomorrowProjection = InspectData["tomorrowProjection"];

const TOMORROW: Record<Protocol, TomorrowProjection> = {
  "Deep Work":     { recoveryRisk: "LOW", projectedCapacity: 7.8, explanation: "High-capacity execution with proper stopping points supports tomorrow's baseline. Consistent sleep determines the ceiling." },
  "Standard Plan": { recoveryRisk: "LOW", projectedCapacity: 7.2, explanation: "Balanced execution today maintains tomorrow's capacity within normal range. No elevated recovery risk projected." },
  "Strict Floor":  { recoveryRisk: "LOW", projectedCapacity: 6.8, explanation: "Following the strict floor today preserves recovery headroom. Capacity is expected to stabilize by tomorrow." },
  "Recovery":      { recoveryRisk: "LOW", projectedCapacity: 7.4, explanation: "Recovery protocol is expected to restore baseline capacity. Movement block supports physiological reset." },
};

export function deriveInspectData(input: SlateInput): InspectData {
  const { energy, cognitiveLoad, workToday, constraint, trainingToday, day } = input;
  const protocol = deriveProtocol(input);

  // Primary Limiting Factor
  let limitingFactor: InspectData["limitingFactor"] = null;
  if (cognitiveLoad === "high" && energy <= 5) {
    limitingFactor = {
      label: "High Cognitive Load",
      explanation: "Cognitive load exceeded the preferred threshold for sustained deep work. Slate reduced mentally demanding tasks to preserve execution quality.",
    };
  } else if (energy <= 4) {
    limitingFactor = {
      label: "Low Energy",
      explanation: "Energy level is below the minimum viable threshold. Slate applied the strict floor to protect recovery capacity.",
    };
  } else if (cognitiveLoad === "high") {
    limitingFactor = {
      label: "High Cognitive Load",
      explanation: "Elevated cognitive load reduces capacity for sustained focus. Slate constrained the plan to prevent compounding mental fatigue.",
    };
  } else if (workToday === "yes" && energy < 7) {
    limitingFactor = {
      label: "Time Constraints",
      explanation: "Work shift limits the available execution window. Slate prioritized high-leverage tasks within the morning block.",
    };
  }

  // Positive Signals
  const positiveSignals: string[] = [];
  if (energy >= 8) positiveSignals.push("↑ Energy in high-capacity range");
  else if (energy >= 7) positiveSignals.push("↑ Energy above weekly threshold");
  if (cognitiveLoad === "low") positiveSignals.push("↑ Cognitive load clear");
  else if (cognitiveLoad === "medium") positiveSignals.push("↑ Cognitive load manageable");
  if ((trainingToday === "yes" || trainingToday === "auto") && energy >= 6) {
    positiveSignals.push("↑ Physical training capacity available");
  }
  if (workToday === "no") positiveSignals.push("↑ Extended execution window available");

  // Constraints
  const constraints: string[] = [];
  if (workToday === "yes") constraints.push("Work shift — morning execution window only");
  if (constraint && constraint.trim()) constraints.push(constraint.trim());
  if (trainingToday === "no") constraints.push("Training skipped — movement not scheduled");
  if (energy <= 5 && workToday === "yes") constraints.push("Energy below work-day optimal");
  if (day.toLowerCase() === "friday") constraints.push("Tomorrow is a workday");
  if (day.toLowerCase() === "sunday") constraints.push("Recovery day — financial review included");

  // Confidence
  let confidence = 74;
  if (trainingToday && trainingToday !== "auto") confidence += 5;
  if (constraint && constraint.trim()) confidence += 5;
  if (cognitiveLoad !== "high" && energy >= 6) confidence += 7;
  if (energy >= 7 && cognitiveLoad === "low") confidence += 5;
  confidence = Math.min(confidence, 97);

  // Adaptive Opportunity
  let adaptiveOpportunity: string | null = null;
  if (workToday === "yes" && energy >= 6 && cognitiveLoad !== "high") {
    adaptiveOpportunity = "If energy holds this evening, consider adding 30–45 minutes of focused coding without substantially increasing recovery risk.";
  } else if (workToday === "no" && energy >= 7) {
    adaptiveOpportunity = "If capacity remains elevated after movement, an additional 25–30 minute study session is viable before the evening window closes.";
  }

  const tomorrowProjection = TOMORROW[protocol];

  return {
    limitingFactor,
    positiveSignals,
    constraints,
    tradeoff: TRADEOFF[protocol],
    optimizationPriorities: ["Execution Probability", "Sustainability", "Recovery Preservation", "Goal Alignment"],
    confidence,
    adaptiveOpportunity,
    tomorrowProjection,
  };
}
