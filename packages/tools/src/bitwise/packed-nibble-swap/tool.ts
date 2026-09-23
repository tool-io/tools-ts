import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ byte: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "byte", label: "Byte", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.byte, 0, 255);
  return H.finish({
    swappedByte: (i.byte % 16) * 16 + Math.floor(i.byte / 16),
  });
};
export const example = {
  input: { byte: 163 },
  output: { result: { swappedByte: 58 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bitwise/packed-nibble-swap",
  title: "Bitwise: Packed Nibble Swap Tool",
  description:
    "Swap the high and low four-bit nibbles of one unsigned byte; no byte-order conversion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { swappedByte: { type: "number" } },
        required: ["swappedByte"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
