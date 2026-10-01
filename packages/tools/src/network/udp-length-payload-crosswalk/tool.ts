import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ udpLength: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "udpLength", label: "Udp length", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.udpLength, 8, 65535);
  return H.finish({ payloadBytes: i.udpLength - 8 });
};
export const example = {
  input: { udpLength: 12 },
  output: { result: { payloadBytes: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/udp-length-payload-crosswalk",
  title: "Network: UDP Length Payload Crosswalk Tool",
  description:
    "Translate a standard non-jumbogram UDP datagram length into payload bytes by removing the fixed eight-byte header, rejecting invalid lengths.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { payloadBytes: { type: "number" } },
        required: ["payloadBytes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
