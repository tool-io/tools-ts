import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  binary,
  sum,
} from "../batch46-shared.js";
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
  const scores = input.independentlyAnnotatedCriterionScores,
    weights = input.callerCalibratedCriterionWeights,
    known = input.criterionKnownFlags;
  if (scores.length !== 5)
    simpleError(
      "items",
      "Exactly five independently verified Srole item codes.",
    );
  aligned(scores, weights, "weights");
  aligned(scores, known, "known");
  binary(scores, "item-code");
  binary(known, "known");
  if (weights.some((v) => v !== 1))
    simpleError(
      "weights",
      "The stated binary five-item sum requires unit weights, not an invented weighting scheme.",
    );
  const lower = sum(scores.map((v, i) => v * known[i])),
    unknown = known.flatMap((v, i) => (v ? [] : [i]));
  return {
    knownItemSum: lower,
    minimumPossibleFiveItemSum: lower,
    maximumPossibleFiveItemSum: lower + unknown.length,
    unknownItemIndices: unknown,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyAnnotatedCriterionScores: [1, 0, 1, 0, 1],
    callerCalibratedCriterionWeights: [1, 1, 1, 1, 1],
    criterionKnownFlags: [1, 1, 1, 1, 1],
  },
  output: {
    result: {
      knownItemSum: 3,
      minimumPossibleFiveItemSum: 3,
      maximumPossibleFiveItemSum: 3,
      unknownItemIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/anomie-scale-srole-five-item",
  title: "Srole Five-Item Anomie Scale Score",
  description:
    "Sum exactly five independently verified binary Srole anomie item codes with unit weights under the caller's documented instrument edition/coding. Known sum and full possible lower/upper sums preserve missing item evidence without imputation. No questionnaire wording, reverse-coding interpretation, clinical diagnosis or universal population norm is invented.",
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
