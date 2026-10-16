import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  values: readonly number[];
  edges: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "values", label: "values", kind: "numberList" },
  { id: "edges", label: "edges", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
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
  discovery: {
    aliases: ["Histogram Sample Provenance Groups", "histograms", "statistics"],
    collections: ["data", "learn"],
    fields: ["histogram", "histograms", "statistics"],
    keywords: ["histograms", "statistics"],
  },
  id: "histogram/bin-sample-provenance-groups",
  title: "Histogram Sample Provenance Groups",
  description:
    "Group source observation indexes by explicit histogram bin using final-edge-inclusive convention, preserving duplicates and outside provenance.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          bins: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
          outside: { type: "array", items: { type: "number" } },
        },
        required: ["bins", "outside"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
