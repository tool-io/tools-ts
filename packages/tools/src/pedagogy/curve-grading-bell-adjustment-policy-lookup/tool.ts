import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  mean,
  standardDeviation,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedRawScores: readonly number[];
  readonly callerTargetMean: number;
  readonly callerTargetPopulationSd: number;
}>;
export type Output = Readonly<{
  readonly callerAffineAdjustedScores: readonly number[];
}>;
const inputFields = [
  { id: "observedRawScores", label: "Observed raw scores", kind: "numberList" },
  { id: "callerTargetMean", label: "Caller target mean", kind: "number" },
  {
    id: "callerTargetPopulationSd",
    label: "Caller target population sd",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerTargetPopulationSd, "callerTargetPopulationSd");
  const m = mean(input.observedRawScores),
    s = positive(
      standardDeviation(input.observedRawScores),
      "observed score spread",
    );
  return {
    callerAffineAdjustedScores: input.observedRawScores.map(
      (v) =>
        input.callerTargetMean + ((v - m) / s) * input.callerTargetPopulationSd,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRawScores: [50, 70, 90],
  callerTargetMean: 80,
  callerTargetPopulationSd: 5,
} satisfies Input;
export const exampleOutput = {
  callerAffineAdjustedScores: [73.87627564304205, 80, 86.12372435695795],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/curve-grading-bell-adjustment-policy-lookup",
  title: "Curve Grading Bell Adjustment Policy Lookup",
  description:
    "Explicit caller affine population SD curvepolicy, unclipped adjusted scores and rank retained; not forced bell-shaped distribution or norm fairness. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerAffineAdjustedScores",
      label: "Caller affine adjusted scores",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRawScores: value.observedRawScores as readonly number[],
      callerTargetMean: value.callerTargetMean as number,
      callerTargetPopulationSd: value.callerTargetPopulationSd as number,
    }),
});
export const run = tool.execute;
export default tool;
