import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ ipv4: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "ipv4", kind: "string", label: "ipv4" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    address: H.ipText((65535n << 32n) | H.ip(i.ipv4, 32), 128),
  });
};
export const example = {
  input: { ipv4: "192.0.2.1" },
  output: { result: { address: "0000:0000:0000:0000:0000:ffff:c000:0201" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv6-mapped-ipv4-payload-builder",
  title: "IPv6 Mapped IPv4 Payload Builder",
  description:
    "Build the exact IPv4-mapped IPv6 address for a validated IPv4 payload, formatted fully expanded; not NAT64 or an interface assignment.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
