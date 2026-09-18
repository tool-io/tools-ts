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
  H.check(
    i.numerators.length === i.denominators.length &&
      i.denominators.every((x) => x !== 0),
  );
  const ratios = i.numerators.map((x, j) => x / i.denominators[j]);
  return H.finish({ ratios, mean: H.mean(ratios) });
};
export const example = {
  input: { numerators: [2, 4], denominators: [1, 4] },
  output: { result: { ratios: [2, 1], mean: 1.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "statistics/mean-of-paired-ratios",
  title: "Mean Of Paired Ratios",
  description:
    "Compute the mean of explicit paired finite ratios, rejecting any zero denominator rather than silently omitting undefined pairs; no ratio-of-sums substitution.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
