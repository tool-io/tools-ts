import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ first: number; last: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "first", label: "first", kind: "integer" },
  { id: "last", label: "last", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.first, -1e9, 1e9);
  H.int(i.last, i.first, i.first + 126);
  return H.finish({
    edges: Array.from(
      { length: i.last - i.first + 2 },
      (_, j) => i.first - 0.5 + j,
    ),
  });
};
export const example = {
  input: { first: -1, last: 2 },
  output: { result: { edges: [-1.5, -0.5, 0.5, 1.5, 2.5] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Histogram Integer Centered Edge Plan",
      "histograms",
      "statistics",
    ],
    collections: ["data", "learn"],
    fields: ["histogram", "histograms", "statistics"],
    keywords: ["histograms", "statistics"],
  },
  id: "histogram/integer-centered-edge-plan",
  title: "Histogram Integer Centered Edge Plan",
  description:
    "Plan half-integer edges centered on each integer observation from first through last inclusive; finite bounded safe centers only.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { edges: { type: "array", items: { type: "number" } } },
        required: ["edges"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
