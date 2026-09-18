import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  edges: readonly number[];
  mass: readonly number[];
  boundaries: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "edges", label: "edges", kind: "numberList" },
  { id: "mass", label: "mass", kind: "numberList" },
  { id: "boundaries", label: "boundaries", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.histogram(i.edges, i.mass);
  H.check(
    i.boundaries.length >= 2 &&
      i.boundaries[0] === 0 &&
      i.boundaries.at(-1) === i.mass.length,
  );
  i.boundaries.forEach((x, j) => {
    H.int(x, 0, i.mass.length);
    H.check(!j || x > i.boundaries[j - 1]);
  });
  return H.finish({
    edges: i.boundaries.map((j) => i.edges[j]),
    mass: i.boundaries
      .slice(1)
      .map((end, j) =>
        i.mass.slice(i.boundaries[j], end).reduce((s, x) => s + x, 0),
      ),
  });
};
export const example = {
  input: { edges: [0, 1, 2, 4], mass: [1, 2, 3], boundaries: [0, 2, 3] },
  output: { result: { edges: [0, 2, 4], mass: [3, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "histogram/bin-adjacent-merge-plan",
  title: "Histogram Adjacent Bin Merge Plan",
  description:
    "Explicit finite ordered histogram edges and nonnegative mass observations; merge whole adjacent bins using explicit increasing boundary indexes including both endpoints; no proportional splitting or extrapolation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
