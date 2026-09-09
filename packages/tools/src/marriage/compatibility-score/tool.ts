import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  weightedMean,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyAgreedCompatibilityCriteriaScores: readonly number[];
  readonly callerIndependentlyAgreedCriterionWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyAgreedCompatibilityCriteriaScores",
    label: "Caller independently agreed compatibility criteria scores",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyAgreedCriterionWeights",
    label: "Caller independently agreed criterion weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  input.callerIndependentlyAgreedCompatibilityCriteriaScores.forEach((v) =>
    fraction(v, "score"),
  );
  return {
    conditionalCallerWeightedCompatibilityPercent:
      100 *
      weightedMean(
        input.callerIndependentlyAgreedCompatibilityCriteriaScores,
        input.callerIndependentlyAgreedCriterionWeights,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyAgreedCompatibilityCriteriaScores: [0.5, 1],
    callerIndependentlyAgreedCriterionWeights: [1, 1],
  },
  output: { result: { conditionalCallerWeightedCompatibilityPercent: 75 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/compatibility-score",
  title: "Compatibility Score Calculator",
  description:
    "Custom mutually established0\u20131criterion weighted compatibility bookkeeping, not validated romantic compatibility, predictive success or relationship decision. Actual criterion definitions/consent and positive weights independently established.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
