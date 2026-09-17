import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  address: string;
  prefix: number;
  offset: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "address", kind: "string", label: "address" },
  { id: "prefix", kind: "integer", label: "prefix" },
  { id: "offset", kind: "string", label: "offset" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.prefix(i.address, i.prefix, 32),
    offset = H.bigint(i.offset);
  H.check(offset >= 0n && offset < r.size);
  return H.finish({ address: H.ipText(r.start + offset, 32) });
};
export const example = {
  input: { address: "10.0.0.1", prefix: 24, offset: "255" },
  output: { result: { address: "10.0.0.255" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-prefix-offset-address",
  title: "IPv4 Prefix Offset Address",
  description:
    "Locate an exact zero-based offset within a normalized IPv4 prefix, including network and broadcast addresses; no assignability promise.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
