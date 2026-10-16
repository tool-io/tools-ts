import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ edges: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "edges", label: "edges", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.histogramEdges(i.edges);
  return H.finish({
    bins: i.edges.slice(1).map((right, j) => ({
      left: i.edges[j],
      right,
      width: right - i.edges[j],
      center: i.edges[j] / 2 + right / 2,
    })),
  });
};
export const example = {
  input: { edges: [0, 2, 5] },
  output: {
    result: {
      bins: [
        { left: 0, right: 2, width: 2, center: 1 },
        { left: 2, right: 5, width: 3, center: 3.5 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Histogram Edge Width Center Table", "histograms", "statistics"],
    collections: ["data", "learn"],
    fields: ["histogram", "histograms", "statistics"],
    keywords: ["histograms", "statistics"],
  },
  id: "histogram/edge-width-center-table",
  title: "Histogram Edge Width Center Table",
  description:
    "Profile positive-width histogram intervals and arithmetic centers from explicit strictly ordered finite edges; no sample density, unit or distribution inference.",
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
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                left: { type: "number" },
                right: { type: "number" },
                width: { type: "number" },
                center: { type: "number" },
              },
              required: ["left", "right", "width", "center"],
            },
          },
        },
        required: ["bins"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
