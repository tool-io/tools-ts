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
  id: "museology/significance-weighted-sum-score",
  title: "Significance Value Score Weighted Sum Calculator",
  description:
    "Restricted institution-calibrated three-domain significance summary, not universal value, legal status or an automatic treatment priority. This restricted caller-defined rubric has three independently declared criterion domains: independently assessed historical significance, independently assessed artistic significance, independently assessed research/community significance. Scores 0\u2013100, nonnegative calibrated weights; known-only normalized mean and unresolved weight retained. No universal validated model, population risk prediction, personal diagnosis or authorization.",
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
