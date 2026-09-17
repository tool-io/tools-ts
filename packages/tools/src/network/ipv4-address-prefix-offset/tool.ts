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
  const r = H.prefix(i.network, i.prefix, 32),
    v = H.ip(i.address, 32);
  return H.finish({
    member: v >= r.start && v <= r.end,
    offset: v >= r.start && v <= r.end ? String(v - r.start) : null,
  });
};
export const example = {
  input: { address: "10.0.0.255", network: "10.0.0.0", prefix: 24 },
  output: { result: { member: true, offset: "255" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-address-prefix-offset",
  title: "IPv4 Address Prefix Offset",
  description:
    "Return an address\u2019s exact zero-based prefix offset only when it belongs to an explicitly normalized IPv4 network; outside offsets remain null.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
