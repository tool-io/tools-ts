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
  return H.finish({ continuation: i.byte >= 128, payload: i.byte % 128 });
};
export const example = {
  input: { byte: 129 },
  output: { result: { continuation: true, payload: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "decode/leb128-byte-continuation-bit",
  title: "Decoding: Leb128 Byte Continuation Bit Tool",
  description:
    "Split one LEB128 byte into continuation flag and seven-bit payload without interpreting a whole signed/unsigned integer stream.",
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
          continuation: { type: "boolean" },
          payload: { type: "number" },
        },
        required: ["continuation", "payload"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
