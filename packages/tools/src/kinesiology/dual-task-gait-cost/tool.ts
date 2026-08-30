import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly singleTaskMps: number;
  readonly dualTaskMps: number;
}>;
export type Output = Readonly<{
  readonly gaitCostPercent: number;
  readonly dualToSingleRatio: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.singleTaskMps <= 0 || input.dualTaskMps < 0)
    simpleError(
      "singleTaskMps",
      "Positive baseline gait speed and nonnegative dual-task speed required.",
    );
  const dualToSingleRatio = input.dualTaskMps / input.singleTaskMps;
  return { gaitCostPercent: 100 * (1 - dualToSingleRatio), dualToSingleRatio };
};
export const exampleInput = {
  singleTaskMps: 2,
  dualTaskMps: 1,
} satisfies Input;
export const exampleOutput = {
  gaitCostPercent: 50,
  dualToSingleRatio: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/dual-task-gait-cost",
  title: "Dual Task Gait Cost",
  description: "Measure percentage change in gait speed during a dual task.",
  inputs: [
    { id: "singleTaskMps", label: "Single task mps", kind: "number" },
    { id: "dualTaskMps", label: "Dual task mps", kind: "number" },
  ],
  outputs: [
    { id: "gaitCostPercent", label: "Gait cost percent", kind: "number" },
    { id: "dualToSingleRatio", label: "Dual to single ratio", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      singleTaskMps: value.singleTaskMps as number,
      dualTaskMps: value.dualTaskMps as number,
    }),
});
export const run = tool.execute;
export default tool;
