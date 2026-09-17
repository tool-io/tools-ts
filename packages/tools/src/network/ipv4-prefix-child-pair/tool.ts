import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ address: string; prefix: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "address", kind: "string", label: "address" },
  { id: "prefix", kind: "integer", label: "prefix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.prefix(i.address, i.prefix, 32);
  H.check(i.prefix < 32);
  return H.finish({
    children: [
      { address: H.ipText(r.start, 32), prefix: i.prefix + 1 },
      { address: H.ipText(r.start + r.size / 2n, 32), prefix: i.prefix + 1 },
    ],
  });
};
export const example = {
  input: { address: "10.0.0.1", prefix: 30 },
  output: {
    result: {
      children: [
        { address: "10.0.0.0", prefix: 31 },
        { address: "10.0.0.2", prefix: 31 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-prefix-child-pair",
  title: "IPv4 Prefix Child Pair",
  description:
    "Split a normalized IPv4 CIDR into its two equal immediate child prefixes; /32 leaves have no children and are rejected.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
