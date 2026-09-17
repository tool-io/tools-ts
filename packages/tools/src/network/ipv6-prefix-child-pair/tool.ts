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
  const r = H.prefix(i.address, i.prefix, 128);
  H.check(i.prefix < 128);
  return H.finish({
    children: [
      { address: H.ipText(r.start, 128), prefix: i.prefix + 1 },
      { address: H.ipText(r.start + r.size / 2n, 128), prefix: i.prefix + 1 },
    ],
  });
};
export const example = {
  input: { address: "::1", prefix: 126 },
  output: {
    result: {
      children: [
        { address: "0000:0000:0000:0000:0000:0000:0000:0000", prefix: 127 },
        { address: "0000:0000:0000:0000:0000:0000:0000:0002", prefix: 127 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv6-prefix-child-pair",
  title: "IPv6 Prefix Child Pair",
  description:
    "Return the two immediate IPv6 child prefixes of a normalized non-leaf parent; /128 leaves are rejected rather than wrapped.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
