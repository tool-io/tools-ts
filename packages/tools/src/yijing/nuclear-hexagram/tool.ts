import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ lines: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "lines", label: "Lines", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.lines.length === 6);
  i.lines.forEach((x) => H.int(x, 0, 1));
  return H.finish({
    nuclearLines: [
      i.lines[1],
      i.lines[2],
      i.lines[3],
      i.lines[2],
      i.lines[3],
      i.lines[4],
    ],
    sourcePositions: [2, 3, 4, 3, 4, 5],
  });
};
export const example = {
  input: { lines: [0, 1, 0, 1, 0, 1] },
  output: {
    result: {
      nuclearLines: [1, 0, 1, 0, 1, 0],
      sourcePositions: [2, 3, 4, 3, 4, 5],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "yijing/nuclear-hexagram",
  title: "Yijing Nuclear Hexagram Calculator",
  description:
    "Construct the conventional nuclear figure from overlapping bottom-counted line sets 2-3-4 and 3-4-5; explicitly no predictive interpretation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nuclearLines: { type: "array", items: { type: "number" } },
          sourcePositions: { type: "array", items: { type: "number" } },
        },
        required: ["nuclearLines", "sourcePositions"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
