import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError, mean } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyStandardizedZScores: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyStandardizedZScores",
    label: "Actual independently standardized z scores",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualIndependentlyStandardizedZScores.length)
    simpleError(
      "actualIndependentlyStandardizedZScores",
      "Actual nonempty observations.",
    );
  return { value: mean(input.actualIndependentlyStandardizedZScores) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualIndependentlyStandardizedZScores: [0, 1, 2] },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/z-composite-average-standardized",
  title: "Z Composite Average Standardized Tool",
  description:
    "Arithmetic mean independently matched standardized components, not a unit SD renormalizedcomposite or inversecovariancefactor score. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
