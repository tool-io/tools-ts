import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ byteOffset: number; bit: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "byteOffset", label: "Byte offset", kind: "integer" },
  { id: "bit", label: "Bit", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.byteOffset, 0, 0xfffff);
  H.int(i.bit, 0, 7);
  return H.finish({ aliasOffset: i.byteOffset * 32 + i.bit * 4 });
};
export const example = {
  input: { byteOffset: 2, bit: 3 },
  output: { result: { aliasOffset: 76 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "microcontroller/gpio-register-bit-band-offset",
  title: "Microcontroller: GPIO Register Bit Band Offset Tool",
  description:
    "Compute a classic ARM bit-band alias offset from a region-relative byte offset and bit index; caller must establish that the device implements bit-banding.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { aliasOffset: { type: "number" } },
        required: ["aliasOffset"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
