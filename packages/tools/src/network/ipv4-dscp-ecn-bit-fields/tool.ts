import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ trafficClassByte: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "trafficClassByte", label: "Traffic class byte", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.trafficClassByte, 0, 255);
  return H.finish({
    dscp: Math.floor(i.trafficClassByte / 4),
    ecn: i.trafficClassByte % 4,
  });
};
export const example = {
  input: { trafficClassByte: 187 },
  output: { result: { dscp: 46, ecn: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-dscp-ecn-bit-fields",
  title: "Network: IPv4 Dscp Ecn Bit Fields Tool",
  description:
    "Split the RFC2474/RFC3168 traffic-class octet into six-bit DSCP and two-bit ECN fields; not a packet decoder or codepoint policy registry.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { dscp: { type: "number" }, ecn: { type: "number" } },
        required: ["dscp", "ecn"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
