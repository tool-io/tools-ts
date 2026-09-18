import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ values: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "values", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const positive = i.values.reduce((s, x) => s + Math.max(0, x), 0),
    negative = i.values.reduce((s, x) => s + Math.min(0, x), 0);
  return H.finish({
    positive,
    negative,
    net: positive + negative,
    balance:
      positive - negative
        ? (positive + negative) / (positive - negative)
        : null,
  });
};
export const example = {
  input: { values: [3, -1, -2, 0] },
  output: { result: { positive: 3, negative: -3, net: 0, balance: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "statistics/positive-negative-sum-balance",
  title: "Positive Negative Sum Balance",
  description:
    "Report positive and negative signed totals with net and magnitude-normalized balance; all-zero observations have unknown/null balance.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
