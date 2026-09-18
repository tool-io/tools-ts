import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  weights: readonly number[];
  denominatorKnown: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "weights", label: "weights", kind: "numberList" },
  { id: "denominatorKnown", label: "denominatorKnown", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.weights.length === i.denominatorKnown.length &&
      i.weights.every((x) => x >= 0) &&
      i.denominatorKnown.every((x) => x === 0 || x === 1),
  );
  const total = i.weights.reduce((s, x) => s + x, 0),
    covered = i.weights.reduce((s, x, j) => s + x * i.denominatorKnown[j], 0);
  return H.finish({
    totalWeight: total,
    coveredWeight: covered,
    coverage: total ? covered / total : null,
  });
};
export const example = {
  input: { weights: [2, 3, 5], denominatorKnown: [1, 0, 1] },
  output: { result: { totalWeight: 10, coveredWeight: 7, coverage: 0.7 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "statistics/weighted-denominator-coverage",
  title: "Weighted Denominator Coverage",
  description:
    "Report nonnegative weight coverage with explicitly known denominator evidence; unknown denominators are not silently treated as zeros or included in ratios.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
