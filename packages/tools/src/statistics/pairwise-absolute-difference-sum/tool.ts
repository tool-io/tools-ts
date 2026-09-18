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
  return H.finish({
    sum: i.values.reduce(
      (s, x, j) =>
        s + i.values.slice(j + 1).reduce((t, y) => t + Math.abs(x - y), 0),
      0,
    ),
  });
};
export const example = {
  input: { values: [1, 2, 4] },
  output: { result: { sum: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "statistics/pairwise-absolute-difference-sum",
  title: "Pairwise Absolute Difference Sum",
  description:
    "Sum absolute differences over every unordered observation pair exactly once; no normalization into Gini or dispersion estimators.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
