import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  numerators: readonly number[];
  denominators: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "numerators", label: "numerators", kind: "numberList" },
  { id: "denominators", label: "denominators", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.numerators.length === i.denominators.length);
  const numerator = i.numerators.reduce((s, x) => s + x, 0),
    denominator = i.denominators.reduce((s, x) => s + x, 0);
  return H.finish({
    ratio: denominator === 0 ? null : numerator / denominator,
    numerator,
    denominator,
  });
};
export const example = {
  input: { numerators: [2, 4], denominators: [1, 3] },
  output: { result: { ratio: 1.5, numerator: 6, denominator: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "statistics/ratio-of-sums",
  title: "Ratio Of Sums",
  description:
    "Compute ratio of paired sums, retaining signed denominator totals and null at zero; differs from the mean of individual ratios.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
