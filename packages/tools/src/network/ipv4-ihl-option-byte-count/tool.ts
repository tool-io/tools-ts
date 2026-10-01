import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ ihl: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "ihl", label: "Ihl", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.ihl, 5, 15);
  return H.finish({ headerBytes: i.ihl * 4, optionBytes: (i.ihl - 5) * 4 });
};
export const example = {
  input: { ihl: 6 },
  output: { result: { headerBytes: 24, optionBytes: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-ihl-option-byte-count",
  title: "Network: IPv4 Ihl Option Byte Count Tool",
  description:
    "Translate an RFC791 IPv4 IHL nibble into total header bytes and optional-header extent, validating the5..15 word range; no packet parser.",
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
          headerBytes: { type: "number" },
          optionBytes: { type: "number" },
        },
        required: ["headerBytes", "optionBytes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
