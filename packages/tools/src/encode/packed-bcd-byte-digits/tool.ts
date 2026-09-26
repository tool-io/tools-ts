import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ tens: number; units: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tens", label: "Tens", kind: "integer" },
  { id: "units", label: "Units", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.tens, 0, 9);
  H.int(i.units, 0, 9);
  return H.finish({ byte: 16 * i.tens + i.units });
};
export const example = {
  input: { tens: 4, units: 2 },
  output: { result: { byte: 66 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "encode/packed-bcd-byte-digits",
  title: "Encoding: Packed BCD Byte Digits Tool",
  description:
    "Pack exactly two explicit decimal digits into one packed-BCD octet, without a sign nibble or text encoding.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { byte: { type: "number" } },
        required: ["byte"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
