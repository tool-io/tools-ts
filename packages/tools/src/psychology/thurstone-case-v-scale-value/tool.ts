import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  fraction,
  mean,
  normalQuantile,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualPairwisePreferenceProbabilities: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPairwisePreferenceProbabilities",
    label: "Actual pairwise preference probabilities",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualPairwisePreferenceProbabilities.length)
    simpleError(
      "actualPairwisePreferenceProbabilities",
      "Actual nonempty observations.",
    );
  input.actualPairwisePreferenceProbabilities.forEach((v) =>
    fraction(v, "actualPairwisePreferenceProbabilities"),
  );
  if (input.actualPairwisePreferenceProbabilities.some((v) => v <= 0 || v >= 1))
    simpleError("probabilities", "Actualinteriorpreferencefractions.");
  return {
    value: mean(
      input.actualPairwisePreferenceProbabilities.map((v) => normalQuantile(v)),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualPairwisePreferenceProbabilities: [0.25, 0.75] },
  output: { result: { value: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/thurstone-case-v-scale-value",
  title: "Thurstone Case V Scale Value Calculator",
  description:
    "Restricted ThurstoneCaseVcolumnmeanprobit scale value from actual identified item pair preference fractions interior0\u20131, symmetric equal variance difference convention. No full model fit, missing comparison imputation or scale origin identified. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
