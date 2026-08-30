import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly previousFitness: number;
  readonly previousFatigue: number;
  readonly todayTrainingLoad: number;
  readonly fitnessRetention: number;
  readonly fatigueRetention: number;
  readonly fitnessLoadGain: number;
  readonly fatigueLoadGain: number;
}>;
export type Output = Readonly<{
  readonly fitness: number;
  readonly fatigue: number;
  readonly trainingStressBalance: number;
}>;
export const calculate = (input: Input): Output => {
  const v = [input.fitnessRetention, input.fatigueRetention];
  if (
    input.previousFitness < 0 ||
    input.previousFatigue < 0 ||
    input.todayTrainingLoad < 0 ||
    v.some((x) => x < 0 || x > 1) ||
    input.fitnessLoadGain < 0 ||
    input.fatigueLoadGain < 0
  )
    simpleError(
      "todayTrainingLoad",
      "Nonnegative state/load/gains and 0–1 retention factors required.",
    );
  const fitness =
      input.previousFitness * input.fitnessRetention +
      input.todayTrainingLoad * input.fitnessLoadGain,
    fatigue =
      input.previousFatigue * input.fatigueRetention +
      input.todayTrainingLoad * input.fatigueLoadGain;
  return { fitness, fatigue, trainingStressBalance: fitness - fatigue };
};
export const exampleInput = {
  previousFitness: 100,
  previousFatigue: 80,
  todayTrainingLoad: 20,
  fitnessRetention: 0.95,
  fatigueRetention: 0.8,
  fitnessLoadGain: 0.1,
  fatigueLoadGain: 0.2,
} satisfies Input;
export const exampleOutput = {
  fitness: 97,
  fatigue: 68,
  trainingStressBalance: 29,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/fitness-fatigue-balance",
  title: "Fitness Fatigue Balance",
  description:
    "Update caller-calibrated fitness and fatigue states from a daily training load.",
  inputs: [
    { id: "previousFitness", label: "Previous fitness", kind: "number" },
    { id: "previousFatigue", label: "Previous fatigue", kind: "number" },
    { id: "todayTrainingLoad", label: "Today training load", kind: "number" },
    { id: "fitnessRetention", label: "Fitness retention", kind: "number" },
    { id: "fatigueRetention", label: "Fatigue retention", kind: "number" },
    { id: "fitnessLoadGain", label: "Fitness load gain", kind: "number" },
    { id: "fatigueLoadGain", label: "Fatigue load gain", kind: "number" },
  ],
  outputs: [
    { id: "fitness", label: "Fitness", kind: "number" },
    { id: "fatigue", label: "Fatigue", kind: "number" },
    {
      id: "trainingStressBalance",
      label: "Training stress balance",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      previousFitness: value.previousFitness as number,
      previousFatigue: value.previousFatigue as number,
      todayTrainingLoad: value.todayTrainingLoad as number,
      fitnessRetention: value.fitnessRetention as number,
      fatigueRetention: value.fatigueRetention as number,
      fitnessLoadGain: value.fitnessLoadGain as number,
      fatigueLoadGain: value.fatigueLoadGain as number,
    }),
});
export const run = tool.execute;
export default tool;
