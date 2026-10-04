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
  const code = i.lines.reduce((s, x, j) => s + x * 2 ** j, 0);
  return H.finish({
    code,
    bottomToTopBits: i.lines.join(""),
    decodedLines: Array.from(
      { length: 6 },
      (_, j) => Math.floor(code / 2 ** j) % 2,
    ),
  });
};
export const example = {
  input: { lines: [1, 0, 0, 0, 0, 0] },
  output: {
    result: {
      code: 1,
      bottomToTopBits: "100000",
      decodedLines: [1, 0, 0, 0, 0, 0],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "yijing/hexagram-binary-codec",
  title: "Yijing Hexagram Binary Encoder and Decoder",
  description:
    "Encode six bottom-to-top yin=0/yang=1 lines with the bottom line as the least-significant bit and return the decoded witness; code is not King Wen numbering.",
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
          bottomToTopBits: { type: "string" },
          code: { type: "number" },
          decodedLines: { type: "array", items: { type: "number" } },
        },
        required: ["bottomToTopBits", "code", "decodedLines"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
