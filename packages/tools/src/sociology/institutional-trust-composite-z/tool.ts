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
    3,
    true,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyAnnotatedCriterionScores: [20, 40, 60],
    callerCalibratedCriterionWeights: [1, 2, 1],
    criterionKnownFlags: [1, 1, 1],
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
  id: "sociology/institutional-trust-composite-z",
  title: "Institutional Trust Composite Z Calculator",
  description:
    "Weighted mean of three independently established signed institution-trust z-scores and caller nonnegative weights. The historical output name knownWeightedScore denotes the weighted z-score, not a 0–100 grade. Each score requires a verified compatible reference population, direction and calibration; missing evidence/weight remains explicit. A weighted mean of z-scores is not automatically unit-variance: covariance/restandardization and survey interpretation remain external.",
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
