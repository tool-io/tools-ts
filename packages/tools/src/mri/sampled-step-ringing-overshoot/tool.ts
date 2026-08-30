import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly edgeProfile: readonly number[];
  readonly lowPlateau: number;
  readonly highPlateau: number;
  readonly overshootCriterionFraction: number;
}>;
export type Output = Readonly<{
  readonly overshootFraction: number;
  readonly undershootFraction: number;
  readonly criterionExceeded: boolean;
}>;
const inputFields = [
  { id: "edgeProfile", label: "Edge profile", kind: "numberList" },
  { id: "lowPlateau", label: "Low plateau", kind: "number" },
  { id: "highPlateau", label: "High plateau", kind: "number" },
  {
    id: "overshootCriterionFraction",
    label: "Overshoot criterion fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.edgeProfile.length)
    simpleError("edgeProfile", "Nonempty sampled edge profile required.");
  const span = positive(input.highPlateau - input.lowPlateau, "highPlateau");
  nonnegative(input.overshootCriterionFraction, "overshootCriterionFraction");
  return {
    overshootFraction:
      Math.max(0, Math.max(...input.edgeProfile) - input.highPlateau) / span,
    undershootFraction:
      Math.max(0, input.lowPlateau - Math.min(...input.edgeProfile)) / span,
    criterionExceeded:
      Math.max(
        Math.max(...input.edgeProfile) - input.highPlateau,
        input.lowPlateau - Math.min(...input.edgeProfile),
      ) /
        span >
      input.overshootCriterionFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  edgeProfile: [0, 0, 1.1, 1, 1],
  lowPlateau: 0,
  highPlateau: 1,
  overshootCriterionFraction: 0.05,
} satisfies Input;
export const exampleOutput = {
  overshootFraction: 0.1,
  undershootFraction: 0,
  criterionExceeded: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/sampled-step-ringing-overshoot",
  title: "Gibbs Ringing Checker",
  description:
    "Screen overshoot/undershoot around a caller-selected intensity edge relative to plateau contrast; this finds ringing-compatible features, not a specific Gibbs-artifact diagnosis.",
  inputs: inputFields,
  outputs: [
    { id: "overshootFraction", label: "Overshoot fraction", kind: "number" },
    { id: "undershootFraction", label: "Undershoot fraction", kind: "number" },
    { id: "criterionExceeded", label: "Criterion exceeded", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      edgeProfile: value.edgeProfile as readonly number[],
      lowPlateau: value.lowPlateau as number,
      highPlateau: value.highPlateau as number,
      overshootCriterionFraction: value.overshootCriterionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
