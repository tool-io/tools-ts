import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  address: string;
  network: string;
  prefix: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "address", kind: "string", label: "address" },
  { id: "network", kind: "string", label: "network" },
  { id: "prefix", kind: "integer", label: "prefix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.prefix(i.network, i.prefix, 128),
    a = H.ip(i.address, 128),
    member = a >= r.start && a <= r.end;
  return H.finish({ member, offset: member ? String(a - r.start) : null });
};
export const example = {
  input: { address: "::3", network: "::", prefix: 126 },
  output: { result: { member: true, offset: "3" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv6-prefix-address-offset",
  title: "IPv6 Prefix Address Offset",
  description:
    "Return exact IPv6 zero-based address offset within a supplied normalized prefix, retaining null for nonmembers.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
