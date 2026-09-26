import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ utf8ByteLength: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "utf8ByteLength", label: "Utf8 byte length", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.utf8ByteLength, 0, 1000000000);
  return H.finish({ prefix: String(i.utf8ByteLength) + ":" });
};
export const example = {
  input: { utf8ByteLength: 12 },
  output: { result: { prefix: "12:" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "encode/netstring-length-prefix",
  title: "Encoding: Netstring Length Prefix Tool",
  description:
    "Format a canonical netstring length prefix from an explicit UTF-8 byte count, not character count and not full framing.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { prefix: { type: "string" } },
        required: ["prefix"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
