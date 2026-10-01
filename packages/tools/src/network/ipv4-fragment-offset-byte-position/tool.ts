import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ fragmentOffset: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fragmentOffset", label: "Fragment offset", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.fragmentOffset, 0, 8191);
  return H.finish({ payloadByteOffset: i.fragmentOffset * 8 });
};
export const example = {
  input: { fragmentOffset: 10 },
  output: { result: { payloadByteOffset: 80 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-fragment-offset-byte-position",
  title: "Network: IPv4 Fragment Offset Byte Position Tool",
  description:
    "Translate the RFC791 thirteen-bit IPv4 fragment offset into original-payload byte position using its standardized eight-byte units; no reassembly.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { payloadByteOffset: { type: "number" } },
        required: ["payloadByteOffset"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
