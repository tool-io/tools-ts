import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
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
    indexes: i.values.map((x) => H.binIndex(x, i.edges)),
    underflow: i.values.flatMap((x, j) => (x < i.edges[0] ? [j] : [])),
    overflow: i.values.flatMap((x, j) => (x > i.edges.at(-1)! ? [j] : [])),
  });
};
export const example = {
  input: { values: [-1, 0, 1, 2, 3], edges: [0, 1, 2] },
  output: {
    result: { indexes: [null, 0, 1, 1, null], underflow: [0], overflow: [4] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "histogram/explicit-edge-membership-indexes",
  title: "Histogram Explicit Edge Membership Indexes",
  description:
    "Assign explicit finite observations to strictly increasing finite bins, left-closed/right-open except final upper edge included; outside values retain null/index provenance.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
