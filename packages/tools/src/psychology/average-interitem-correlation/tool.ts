import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError, mean } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualDistinctOffDiagonalInteritemCorrelations: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDistinctOffDiagonalInteritemCorrelations",
    label: "Actual distinct off diagonal interitem correlations",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualDistinctOffDiagonalInteritemCorrelations.length)
    simpleError(
      "actualDistinctOffDiagonalInteritemCorrelations",
      "Actual nonempty observations.",
    );
  if (
    input.actualDistinctOffDiagonalInteritemCorrelations.some(
      (v) => Math.abs(v) > 1,
    )
  )
    simpleError("correlations", "Actualcorrelations−1…1.");
  return { value: mean(input.actualDistinctOffDiagonalInteritemCorrelations) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualDistinctOffDiagonalInteritemCorrelations: [0.2, 0.8] },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/average-interitem-correlation",
  title: "Average Interitem Correlation Calculator",
  description:
    "Mean independently computed distinct unordered offdiagonalinteritemPearsoncorrelations, diagonal/exclusions externally audited; not mean raw items. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
