import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ flowLabel: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "flowLabel", label: "Flow label", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.flowLabel, 0, 0xfffff);
  return H.finish({ hexadecimal: H.hex(i.flowLabel, 5) });
};
export const example = {
  input: { flowLabel: 1 },
  output: { result: { hexadecimal: "00001" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv6-flow-label-fixed-width",
  title: "Network: IPv6 Flow Label Fixed Width Tool",
  description:
    "Format the IPv6 twenty-bit flow-label field as exactly five uppercase hexadecimal digits, without interpreting routing semantics.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { hexadecimal: { type: "string" } },
        required: ["hexadecimal"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
