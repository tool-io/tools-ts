import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly dailyLoads: readonly number[];
}>;
export type Output = Readonly<{
  readonly meanLoad: number;
  readonly populationStandardDeviation: number;
  readonly monotony: number;
  readonly weeklyStrain: number;
}>;
export const calculate = (input: Input): Output => {
  const values = input.dailyLoads,
    n = values.length;
  if (n < 2 || values.some((v) => v < 0))
    simpleError("dailyLoads", "At least two nonnegative daily loads required.");
  const meanLoad = values.reduce((a, b) => a + b, 0) / n,
    populationStandardDeviation = Math.sqrt(
      values.reduce((a, b) => a + (b - meanLoad) ** 2, 0) / n,
    );
  if (populationStandardDeviation === 0)
    simpleError("dailyLoads", "Monotony is undefined for constant daily load.");
  const monotony = meanLoad / populationStandardDeviation;
  return {
    meanLoad,
    populationStandardDeviation,
    monotony,
    weeklyStrain: values.reduce((a, b) => a + b, 0) * monotony,
  };
};
export const exampleInput = {
  dailyLoads: [100, 200, 100, 200],
} satisfies Input;
export const exampleOutput = {
  meanLoad: 150,
  populationStandardDeviation: 50,
  monotony: 3,
  weeklyStrain: 1800,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/weekly-training-monotony",
  title: "Weekly Training Monotony",
  description:
    "Compute Foster training monotony and strain from daily session loads.",
  inputs: [{ id: "dailyLoads", label: "Daily loads", kind: "numberList" }],
  outputs: [
    { id: "meanLoad", label: "Mean load", kind: "number" },
    {
      id: "populationStandardDeviation",
      label: "Population standard deviation",
      kind: "number",
    },
    { id: "monotony", label: "Monotony", kind: "number" },
    { id: "weeklyStrain", label: "Weekly strain", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      dailyLoads: value.dailyLoads as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
