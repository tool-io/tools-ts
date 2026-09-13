import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch49-shared.js";
export type Input = Readonly<{ readonly actualSplitHalfCorrelation: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSplitHalfCorrelation",
    label: "Actual split half correlation",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.actualSplitHalfCorrelation <= -1 ||
    input.actualSplitHalfCorrelation > 1
  )
    simpleError("correlation", "−1<r≤1.");
  return {
    value:
      (2 * input.actualSplitHalfCorrelation) /
      (1 + input.actualSplitHalfCorrelation),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualSplitHalfCorrelation: 0.5 },
  output: { result: { value: 0.6666666666666666 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/split-half-reliability-spearman-brown",
  title: "Spearman-Brown Split-Half Reliability Calculator",
  description:
    "Spearman\u2013Brown equal-half reliability correction2r/(1+r),\u22121<r\u22641, actual same instrument split. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
