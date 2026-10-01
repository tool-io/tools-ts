import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ flags: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "flags", label: "Flags", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.flags, 0, 7);
  return H.finish({
    reservedSet: i.flags >= 4,
    dontFragment: Math.floor(i.flags / 2) % 2 === 1,
    moreFragments: i.flags % 2 === 1,
  });
};
export const example = {
  input: { flags: 3 },
  output: {
    result: { reservedSet: false, dontFragment: true, moreFragments: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-header-flags-df-mf-pair",
  title: "Network: IPv4 Header Flags Df Mf Pair Tool",
  description:
    "Split the RFC791 three-bit IPv4 flags field into reserved, DF and MF evidence, without silently accepting or rejecting packet fragmentation combinations.",
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
          dontFragment: { type: "boolean" },
          moreFragments: { type: "boolean" },
          reservedSet: { type: "boolean" },
        },
        required: ["dontFragment", "moreFragments", "reservedSet"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
