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
    total,
    densities: i.mass.map((x, j) =>
      total ? x / total / (i.edges[j + 1] - i.edges[j]) : null,
    ),
  });
};
export const example = {
  input: { edges: [0, 1, 3], mass: [2, 2] },
  output: { result: { total: 4, densities: [0.5, 0.25] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "histogram/bin-weight-density-table",
  title: "Histogram Bin Weight Density Table",
  description:
    "Explicit finite ordered histogram edges and nonnegative mass observations; normalize weights by total mass and bin width; zero-total observations have null densities, not zeros.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
