import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  network: string;
  prefix: number;
  offset: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "network", kind: "string", label: "network" },
  { id: "prefix", kind: "integer", label: "prefix" },
  { id: "offset", kind: "string", label: "offset" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.prefix(i.network, i.prefix, 128),
    o = H.bigint(i.offset);
  H.check(o >= 0n && o < r.size);
  return H.finish({ address: H.ipText(r.start + o, 128) });
};
export const example = {
  input: { network: "::", prefix: 126, offset: "3" },
  output: { result: { address: "0000:0000:0000:0000:0000:0000:0000:0003" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv6-prefix-address-at-offset",
  title: "IPv6 Prefix Address at Offset",
  description:
    "Select one IPv6 address at an exact zero-based offset inside a normalized prefix, including every address and avoiding 128-bit floating precision loss.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
