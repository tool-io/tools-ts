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
  const hi = Math.floor(i.byte / 16),
    lo = i.byte % 16;
  H.check(hi <= 9 && lo <= 9);
  return H.finish({ tens: hi, units: lo, decimalValue: 10 * hi + lo });
};
export const example = {
  input: { byte: 66 },
  output: { result: { tens: 4, units: 2, decimalValue: 42 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "decode/packed-bcd-byte-digits",
  title: "Decoding: Packed BCD Byte Digits Tool",
  description:
    "Decode exactly two packed-BCD decimal digits in one unsigned byte, rejecting either nibble above9; no signed trailing nibble or full decimal field.",
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
          decimalValue: { type: "number" },
          tens: { type: "number" },
          units: { type: "number" },
        },
        required: ["decimalValue", "tens", "units"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
