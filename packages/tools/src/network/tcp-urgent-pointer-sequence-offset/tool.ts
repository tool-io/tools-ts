import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  sequenceNumber: string;
  urgentPointer: number;
  urgentFlag: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "sequenceNumber", label: "Sequence number", kind: "string" },
  { id: "urgentPointer", label: "Urgent pointer", kind: "integer" },
  { id: "urgentFlag", label: "Urgent flag", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const seq = H.word(i.sequenceNumber, 32);
  H.int(i.urgentPointer, 0, 65535);
  return H.finish({
    meaningful: i.urgentFlag,
    urgentEndSequence: String((seq + BigInt(i.urgentPointer)) % 0x100000000n),
  });
};
export const example = {
  input: { sequenceNumber: "4294967294", urgentPointer: 4, urgentFlag: true },
  output: { result: { meaningful: true, urgentEndSequence: "2" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/tcp-urgent-pointer-sequence-offset",
  title: "Network: TCP Urgent Pointer Sequence Offset Tool",
  description:
    "Resolve the RFC9293 TCP urgent-pointer offset to the sequence immediately after urgent data modulo2^32; value is explicitly unused when URG is not set.",
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
          meaningful: { type: "boolean" },
          urgentEndSequence: { type: "string" },
        },
        required: ["meaningful", "urgentEndSequence"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
