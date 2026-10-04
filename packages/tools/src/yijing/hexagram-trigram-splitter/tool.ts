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
    lowerCode: i.lines.slice(0, 3).reduce((s, x, j) => s + x * 2 ** j, 0),
    upperCode: i.lines.slice(3).reduce((s, x, j) => s + x * 2 ** j, 0),
  });
};
export const example = {
  input: { lines: [1, 0, 0, 0, 1, 0] },
  output: { result: { lowerCode: 1, upperCode: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "yijing/hexagram-trigram-splitter",
  title: "Yijing Hexagram Trigram Splitter",
  description:
    "Split bottom-to-top lines into lower and upper three-bit trigram identities; no cultural sequence number is inferred.",
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
          lowerCode: { type: "number" },
          upperCode: { type: "number" },
        },
        required: ["lowerCode", "upperCode"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
