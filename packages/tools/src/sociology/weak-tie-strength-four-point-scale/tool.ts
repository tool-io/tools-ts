import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, scoreEvidence } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyAnnotatedCriterionScores: readonly number[];
  readonly callerCalibratedCriterionWeights: readonly number[];
  readonly criterionKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAnnotatedCriterionScores",
    label: "Independently annotated criterion scores",
    kind: "numberList",
  },
  {
    id: "callerCalibratedCriterionWeights",
    label: "Caller calibrated criterion weights",
    kind: "numberList",
  },
  {
    id: "criterionKnownFlags",
    label: "Criterion known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return scoreEvidence(
    input.independentlyAnnotatedCriterionScores,
    input.callerCalibratedCriterionWeights,
    input.criterionKnownFlags,
    4,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyAnnotatedCriterionScores: [20, 40, 60, 80],
    callerCalibratedCriterionWeights: [1, 2, 1, 0],
    criterionKnownFlags: [1, 1, 1, 1],
  },
  output: {
    result: {
      knownWeightedScore: 40,
      unknownWeightFraction: 0,
      unknownCriterionIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/weak-tie-strength-four-point-scale",
  title: "Weak-Tie Strength Four-Point Scale Tool",
  description:
    "Caller-calibrated four-domain tie-strength summary in order: time, emotional intensity, intimacy/confiding, reciprocal services. Independently established scores 0–100 and weights; known-only normalized mean retains unknown evidence/weight. Granovetter's conceptual dimensions are not a canonical validated four-point ordinal scale, and this calculation does not infer a person's relationships or future behavior.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
