import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  edges: readonly number[];
  mass: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "edges", label: "edges", kind: "numberList" },
  { id: "mass", label: "mass", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.histogram(i.edges, i.mass);
  const total = i.mass.reduce((s, x) => s + x, 0);
  return H.finish({
    mean: total
      ? i.mass.reduce(
          (s, x, j) => s + x * (i.edges[j] / 2 + i.edges[j + 1] / 2),
          0,
        ) / total
      : null,
    total,
  });
};
export const example = {
  input: { edges: [0, 2, 4], mass: [1, 3] },
  output: { result: { mean: 2.5, total: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "histogram/bin-center-weighted-mean",
  title: "Histogram Bin Center Weighted Mean",
  description:
    "Explicit finite ordered histogram edges and nonnegative mass observations; calculate a bin-center weighted approximation from aggregated mass, not the exact mean of original samples.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
