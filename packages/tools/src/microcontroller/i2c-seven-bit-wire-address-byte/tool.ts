import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ address: number; read: boolean }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "address", label: "Address", kind: "integer" },
  { id: "read", label: "Read", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.address, 0, 127);
  return H.finish({ wireByte: 2 * i.address + (i.read ? 1 : 0) });
};
export const example = {
  input: { address: 80, read: true },
  output: { result: { wireByte: 161 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "microcontroller/i2c-seven-bit-wire-address-byte",
  title: "Microcontroller: I\u00b2C Seven Bit Wire Address Byte Tool",
  description:
    "Build the first seven-bit I2C address/RW wire octet, retaining the distinction from eight-bit address notation; reserved address use is not certified.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { wireByte: { type: "number" } },
        required: ["wireByte"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
