import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ flagsByte: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "flagsByte", label: "Flags byte", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.flagsByte, 0, 255);
  return H.finish({
    flags: ["FIN", "SYN", "RST", "PSH", "ACK", "URG", "ECE", "CWR"].filter(
      (_, j) => Math.floor(i.flagsByte / 2 ** j) % 2 === 1,
    ),
  });
};
export const example = {
  input: { flagsByte: 18 },
  output: { result: { flags: ["SYN", "ACK"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/tcp-flags-single-byte-label",
  title: "Network: TCP Flags Single Byte Label Tool",
  description:
    "Decode the conventional eight TCP flags bits FIN through CWR from a supplied octet; excludes extended flags in adjacent header bits and state-machine validity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { flags: { type: "array", items: { type: "string" } } },
        required: ["flags"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
