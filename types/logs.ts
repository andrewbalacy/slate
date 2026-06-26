import type { SlateInput, SlatePlan } from "./slate";

export type SlateLog = {
  id: string;
  timestamp: number;
  input: SlateInput;
  plan: SlatePlan;
};
