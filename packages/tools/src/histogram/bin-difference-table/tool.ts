import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  edges: readonly number[];
  left: readonly number[];
  right: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "edges", label: "edges", kind: "numberList" },
  { id: "left", label: "left", kind: "numberList" },
  { id: "right", label: "right", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.histogram(i.edges, i.left);
  H.histogram(i.edges, i.right);
  return H.finish({
    difference: i.right.map((x, j) => x - i.left[j]),
    totalDifference: i.right.reduce((s, x, j) => s + x - i.left[j], 0),
  });
};
export const example = {
  input: { edges: [0, 1, 2], left: [1, 4], right: [3, 1] },
  output: { result: { difference: [2, -3], totalDifference: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Histogram Matched Bin Difference Table",
      "histograms",
      "statistics",
    ],
    collections: ["data", "learn"],
    fields: ["histogram", "histograms", "statistics"],
    keywords: ["histograms", "statistics"],
  },
  id: "histogram/bin-difference-table",
  title: "Histogram Matched Bin Difference Table",
  description:
    "Explicit finite ordered histogram edges and nonnegative mass observations; compare aligned right-minus-left bin masses with signed discrepancies and identical explicitly shared boundaries.",
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
          difference: { type: "array", items: { type: "number" } },
          totalDifference: { type: "number" },
        },
        required: ["difference", "totalDifference"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
