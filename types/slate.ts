export type CognitiveLoad = "low" | "medium" | "high";
export type YesNo = "yes" | "no";
export type TrainingToday = "yes" | "no" | "auto";

export type SlateInput = {
  date: string;
  day: string;
  energy: number;
  cognitiveLoad: CognitiveLoad;
  workToday: YesNo;
  constraint?: string;
  trainingToday?: TrainingToday;
};

export type SlatePlan = {
  title: string;
  blocks: string[];
  closingLine: string;
};
