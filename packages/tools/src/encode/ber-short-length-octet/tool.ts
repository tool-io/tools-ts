import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ length: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "length", label: "Length", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.length, 0, 127);
  return H.finish({ octet: i.length });
};
export const example = {
  input: { length: 127 },
  output: { result: { octet: 127 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "encode/ber-short-length-octet",
  title: "Encoding: Ber Short Length Octet Tool",
  description:
    "Encode one ASN.1 BER short-form length in the allowed0..127 range, rejecting long-form lengths rather than silently truncating.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { octet: { type: "number" } },
        required: ["octet"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
