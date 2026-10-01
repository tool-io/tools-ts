import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ firstOctet: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstOctet", label: "First octet", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.firstOctet, 0, 255);
  return H.finish({
    groupAddress: i.firstOctet % 2 === 1,
    locallyAdministered: Math.floor(i.firstOctet / 2) % 2 === 1,
  });
};
export const example = {
  input: { firstOctet: 3 },
  output: { result: { groupAddress: true, locallyAdministered: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ethernet-mac-group-local-bits",
  title: "Network: Ethernet Mac Group Local Bits Tool",
  description:
    "Decode the I/G and U/L bits in the first Ethernet MAC octet, not a manufacturer/OUI lookup or whole-address validity check.",
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
          groupAddress: { type: "boolean" },
          locallyAdministered: { type: "boolean" },
        },
        required: ["groupAddress", "locallyAdministered"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
