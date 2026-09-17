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
  H.check(i.prefix % 4 === 0);
  const hex = r.start
    .toString(16)
    .padStart(32, "0")
    .slice(0, i.prefix / 4);
  return H.finish({
    zone: (hex ? hex.split("").reverse().join(".") + "." : "") + "ip6.arpa",
  });
};
export const example = {
  input: { address: "2001:db8::1", prefix: 32 },
  output: { result: { zone: "8.b.d.0.1.0.0.2.ip6.arpa" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv6-reverse-zone-prefix-labels",
  title: "IPv6 Reverse Zone Prefix Labels",
  description:
    "Build an IPv6 reverse-zone name for a normalized nibble-aligned prefix; distinct from existing full-address reverse DNS and does not create a DNS delegation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
