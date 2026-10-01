import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  firstHeaderByte: number;
  secondHeaderByte: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstHeaderByte", label: "First header byte", kind: "integer" },
  { id: "secondHeaderByte", label: "Second header byte", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.firstHeaderByte, 0, 255);
  H.int(i.secondHeaderByte, 0, 255);
  H.check(Math.floor(i.firstHeaderByte / 16) === 6);
  return H.finish({
    trafficClass:
      (i.firstHeaderByte % 16) * 16 + Math.floor(i.secondHeaderByte / 16),
    version: Math.floor(i.firstHeaderByte / 16),
    flowLabelHighNibble: i.secondHeaderByte % 16,
  });
};
export const example = {
  input: { firstHeaderByte: 107, secondHeaderByte: 128 },
  output: { result: { trafficClass: 184, version: 6, flowLabelHighNibble: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv6-traffic-class-wire-nibble-pair",
  title: "Network: IPv6 Traffic Class Wire Nibble Pair Tool",
  description:
    "Extract the IPv6 traffic-class octet straddling the first two wire bytes, while retaining adjacent flow-label nibble; version6 is required.",
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
          flowLabelHighNibble: { type: "number" },
          trafficClass: { type: "number" },
          version: { type: "number" },
        },
        required: ["flowLabelHighNibble", "trafficClass", "version"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
