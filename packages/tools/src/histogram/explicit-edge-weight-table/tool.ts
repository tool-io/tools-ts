import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  values: readonly number[];
  weights: readonly number[];
  edges: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "values", kind: "numberList" },
  { id: "weights", label: "weights", kind: "numberList" },
  { id: "edges", label: "edges", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.histogramEdges(i.edges);
  H.check(
    i.values.length === i.weights.length && i.weights.every((x) => x >= 0),
  );
  const indexes = i.values.map((x) => H.binIndex(x, i.edges));
  return H.finish({
    weights: Array.from({ length: i.edges.length - 1 }, (_, j) =>
      indexes.reduce<number>((s, x, k) => s + (x === j ? i.weights[k] : 0), 0),
    ),
    outsideWeight: indexes.reduce<number>(
      (s, x, k) => s + (x === null ? i.weights[k] : 0),
      0,
    ),
  });
};
export const example = {
  input: {
    values: [-1, 0, 1, 2, 3],
    edges: [0, 1, 2],
    weights: [1, 2, 3, 4, 5],
  },
  output: { result: { weights: [2, 7], outsideWeight: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "histogram/explicit-edge-weight-table",
  title: "Histogram Explicit Edge Weight Table",
  description:
    "Sum explicit nonnegative observation weights in supplied histogram bins while retaining total outside weight; not probability normalization or automatic edge selection.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
