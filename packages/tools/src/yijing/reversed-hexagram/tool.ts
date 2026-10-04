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
  const reversed = [...i.lines].reverse();
  return H.finish({
    reversedLines: reversed,
    selfReversing: H.equal(i.lines, reversed),
  });
};
export const example = {
  input: { lines: [1, 0, 0, 0, 0, 0] },
  output: {
    result: { reversedLines: [0, 0, 0, 0, 0, 1], selfReversing: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "yijing/reversed-hexagram",
  title: "Yijing Reversed Hexagram Calculator",
  description:
    "Reverse the bottom-to-top order of a six-line figure and report exact self-reversal; no interpretation or sequence-number lookup.",
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
          reversedLines: { type: "array", items: { type: "number" } },
          selfReversing: { type: "boolean" },
        },
        required: ["reversedLines", "selfReversing"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
