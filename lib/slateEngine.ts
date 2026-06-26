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

export function generateSlatePlan(input: SlateInput): SlatePlan {
  const trainingToday = input.trainingToday ?? "auto";

  if (input.workToday === "yes" && input.cognitiveLoad === "high") {
    return {
      title: "slate.",
      blocks: ["7:15–7:40 → python (25 min)"],
      closingLine: "Minimum only. Protect energy. Sleep 12:15.",
    };
  }

  if (input.workToday === "yes") {
    const blocks = ["7:15–7:40 → python (25 min)"];

    if (trainingToday !== "no") {
      if (input.energy >= 7) {
        blocks.push("7:50–8:15 → short aerobic (20–25 min)");
      } else if (input.energy >= 5) {
        blocks.push("7:50–8:10 → light aerobic (20 min easy)");
      }
    }

    return {
      title: "slate.",
      blocks,
      closingLine: "Execute clean. Stop at 8:30. Sleep 12:15.",
    };
  }

  const blocks = [
    "1:30–3:30 PM → movement (30–40 min)",
    "Later → python (25 min)",
  ];

  if (input.energy >= 7) {
    blocks.push("+ 10–20 min admin");
  }

  if (input.day.toLowerCase() === "sunday") {
    blocks.push("+ 10 min financial review");
  }

  return {
    title: "slate.",
    blocks,
    closingLine: "Front-load leverage. Free after.",
  };
}