import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly preCorrectionMetric: number;
  readonly postCorrectionMetric: number;
  readonly expectedMetric: number;
  readonly tolerance: number;
}>;
export type Output = Readonly<{
  readonly correctionChange: number;
  readonly remainingDifference: number;
  readonly consistent: boolean;
}>;

export const calculate = (input: Input): Output => {
  const correctionChange =
      input.postCorrectionMetric - input.preCorrectionMetric,
    remainingDifference = input.postCorrectionMetric - input.expectedMetric;
  return {
    correctionChange,
    remainingDifference,
    consistent: Math.abs(remainingDifference) <= input.tolerance,
  };
};

export const exampleInput = {
  preCorrectionMetric: 120,
  postCorrectionMetric: 101,
  expectedMetric: 100,
  tolerance: 2,
} satisfies Input;
export const exampleOutput = {
  correctionChange: -19,
  remainingDifference: 1,
  consistent: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      preCorrectionMetric: input.preCorrectionMetric as number,
      postCorrectionMetric: input.postCorrectionMetric as number,
      expectedMetric: input.expectedMetric as number,
      tolerance: input.tolerance as number,
    }),
  description:
    "Recheck final analytical consistency after recorded corrections.",
  id: "auditing/final-analytics-reconciliation",
  inputs: [
    {
      id: "preCorrectionMetric",
      label: "Pre-correction analytic metric",
      kind: "number",
    },
    {
      id: "postCorrectionMetric",
      label: "Post-correction analytic metric",
      kind: "number",
    },
    { id: "expectedMetric", label: "Expected analytic metric", kind: "number" },
    {
      id: "tolerance",
      label: "Allowed absolute difference",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "correctionChange",
      label: "Metric change from corrections",
      kind: "number",
    },
    {
      id: "remainingDifference",
      label: "Post-correction difference from expected",
      kind: "number",
    },
    {
      id: "consistent",
      label: "Post-correction metric is within tolerance",
      kind: "boolean",
    },
  ],
  title: "Final Analytics Reconciliation",
});

export const run = tool.execute;
export default tool;
