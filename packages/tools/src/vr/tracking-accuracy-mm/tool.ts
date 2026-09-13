import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredPositionMm: readonly number[];
  readonly actualIndependentGroundTruthPositionMm: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredPositionMm",
    label: "Actual measured position mm",
    kind: "numberList",
  },
  {
    id: "actualIndependentGroundTruthPositionMm",
    label: "Actual independent ground truth position mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.actualMeasuredPositionMm.length !== 3 ||
    input.actualIndependentGroundTruthPositionMm.length !== 3
  )
    simpleError("position", "Actualthree-dimensionalpositionvectors.");
  return {
    observedEuclideanPositionErrorMm: Math.hypot(
      ...input.actualMeasuredPositionMm.map(
        (v, i) => v - input.actualIndependentGroundTruthPositionMm[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMeasuredPositionMm: [1, 2, 3],
    actualIndependentGroundTruthPositionMm: [0, 2, 3],
  },
  output: { result: { observedEuclideanPositionErrorMm: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/tracking-accuracy-mm",
  title: "Tracking Accuracy mm Calculator",
  description:
    "Actual singlematchedtrackingpositionEuclideanerrorvs independentgroundtruthmm, not precision or latency or inferred tracking accuracy from data rate.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
