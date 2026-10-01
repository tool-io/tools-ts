import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ tagControlInformation: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "tagControlInformation",
    label: "Tag control information",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.tagControlInformation, 0, 65535);
  return H.finish({
    priority: Math.floor(i.tagControlInformation / 8192),
    dropEligible: Math.floor(i.tagControlInformation / 4096) % 2 === 1,
    vlanId: i.tagControlInformation % 4096,
  });
};
export const example = {
  input: { tagControlInformation: 45057 },
  output: { result: { priority: 5, dropEligible: true, vlanId: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/vlan-priority-drop-eligible-bit-fields",
  title: "Network: Vlan Priority Drop Eligible Bit Fields Tool",
  description:
    "Split one IEEE802.1Q sixteen-bit TCI field into PCP, DEI and VID values; does not validate reserved VLAN usage or switch policy.",
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
          dropEligible: { type: "boolean" },
          priority: { type: "number" },
          vlanId: { type: "number" },
        },
        required: ["dropEligible", "priority", "vlanId"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
