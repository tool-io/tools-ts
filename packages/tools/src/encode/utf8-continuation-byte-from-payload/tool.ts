import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ payload: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "payload", label: "Payload", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.payload, 0, 63);
  return H.finish({ byte: 128 + i.payload });
};
export const example = {
  input: { payload: 44 },
  output: { result: { byte: 172 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "encode/utf8-continuation-byte-from-payload",
  title: "Encoding: UTF-8 Continuation Byte From Payload Tool",
  description:
    "Encode one six-bit payload into a UTF-8 continuation octet without claiming that it forms a valid whole code point.",
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
