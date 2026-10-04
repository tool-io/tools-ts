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
  const complementary = i.lines.map((x) => 1 - x);
  return H.finish({
    complementaryLines: complementary,
    binaryCode: complementary.reduce((s, x, j) => s + x * 2 ** j, 0),
  });
};
export const example = {
  input: { lines: [0, 0, 0, 0, 0, 0] },
  output: {
    result: { complementaryLines: [1, 1, 1, 1, 1, 1], binaryCode: 63 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "yijing/complementary-hexagram",
  title: "Yijing Complementary Hexagram Calculator",
  description:
    "Complement all six yin/yang lines and identify the result by its documented bottom-LSB binary code, not a fabricated King Wen name.",
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
          binaryCode: { type: "number" },
          complementaryLines: { type: "array", items: { type: "number" } },
        },
        required: ["binaryCode", "complementaryLines"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
