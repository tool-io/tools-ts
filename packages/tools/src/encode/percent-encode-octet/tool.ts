import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ octet: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "octet", label: "Octet", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.octet, 0, 255);
  return H.finish({ triplet: "%" + H.hex(i.octet) });
};
export const example = {
  input: { octet: 255 },
  output: { result: { triplet: "%FF" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "encode/percent-encode-octet",
  title: "Encoding: Percent Encode Octet Tool",
  description:
    "Format exactly one unsigned byte as an uppercase percent triplet without treating byte values as Unicode text.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { triplet: { type: "string" } },
        required: ["triplet"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
