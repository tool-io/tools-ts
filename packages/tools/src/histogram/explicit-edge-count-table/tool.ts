import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
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
  const indexes = i.values.map((x) => H.binIndex(x, i.edges));
  return H.finish({
    counts: Array.from(
      { length: i.edges.length - 1 },
      (_, j) => indexes.filter((x) => x === j).length,
    ),
    outside: indexes.filter((x) => x === null).length,
  });
};
export const example = {
  input: { values: [-1, 0, 1, 2, 3], edges: [0, 1, 2] },
  output: { result: { counts: [1, 2], outside: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Histogram Explicit Edge Count Table",
      "histograms",
      "statistics",
    ],
    collections: ["data", "learn"],
    fields: ["histogram", "histograms", "statistics"],
    keywords: ["histograms", "statistics"],
  },
  id: "histogram/explicit-edge-count-table",
  title: "Histogram Explicit Edge Count Table",
  description:
    "Count explicit observations in supplied ordered histogram bins with final edge included, reporting outside count without clamping under/overflow into endpoint bins.",
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
          counts: { type: "array", items: { type: "number" } },
          outside: { type: "number" },
        },
        required: ["counts", "outside"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
