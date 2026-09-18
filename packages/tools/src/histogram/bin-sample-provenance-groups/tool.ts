import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  values: readonly number[];
  edges: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "values", kind: "numberList" },
  { id: "edges", label: "edges", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.histogramEdges(i.edges);
  return H.finish({
    bins: i.edges
      .slice(1)
      .map((_, j) =>
        i.values.flatMap((x, index) =>
          H.binIndex(x, i.edges) === j ? [index] : [],
        ),
      ),
    outside: i.values.flatMap((x, index) =>
      H.binIndex(x, i.edges) === null ? [index] : [],
    ),
  });
};
export const example = {
  input: { values: [-1, 0, 1, 2, 3], edges: [0, 1, 2] },
  output: { result: { bins: [[1], [2, 3]], outside: [0, 4] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "histogram/bin-sample-provenance-groups",
  title: "Histogram Sample Provenance Groups",
  description:
    "Group source observation indexes by explicit histogram bin using final-edge-inclusive convention, preserving duplicates and outside provenance.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
