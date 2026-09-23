import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ left: string; right: string; width: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", label: "Left", kind: "string" },
  { id: "right", label: "Right", kind: "string" },
  { id: "width", label: "Width", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const a = H.word(i.left, i.width),
    b = H.word(i.right, i.width),
    m = 2n ** BigInt(i.width);
  return H.finish({
    borrow: a < b,
    wrappedDifference: String((a - b + m) % m),
  });
};
export const example = {
  input: { left: "1", right: "3", width: 8 },
  output: { result: { borrow: true, wrappedDifference: "254" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bitwise/unsigned-less-than-borrow-flag",
  title: "Bitwise: Unsigned Less Than Borrow Flag Tool",
  description:
    "Perform exact fixed-width unsigned subtraction and expose the final borrow flag and wrapped difference independently of signed overflow.",
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
          borrow: { type: "boolean" },
          wrappedDifference: { type: "string" },
        },
        required: ["borrow", "wrappedDifference"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
