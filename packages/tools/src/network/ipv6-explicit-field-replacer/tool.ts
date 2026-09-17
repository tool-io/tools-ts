import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  address: string;
  offset: number;
  width: number;
  value: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "address", kind: "string", label: "address" },
  { id: "offset", kind: "integer", label: "offset" },
  { id: "width", kind: "integer", label: "width" },
  { id: "value", kind: "string", label: "value" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.offset, 0, 128);
  H.int(i.width, 0, 128 - i.offset);
  const v = H.bigint(i.value),
    mask = (1n << BigInt(i.width)) - 1n;
  H.check(v >= 0n && v <= mask);
  const address =
    (H.ip(i.address, 128) & ~(mask << BigInt(i.offset))) |
    (v << BigInt(i.offset));
  return H.finish({ address: H.ipText(address, 128) });
};
export const example = {
  input: { address: "::abcd", offset: 0, width: 8, value: "1" },
  output: { result: { address: "0000:0000:0000:0000:0000:0000:0000:ab01" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv6-explicit-field-replacer",
  title: "IPv6 Explicit Field Replacer",
  description:
    "Replace an exact IPv6 bit field with least-significant-bit offset zero, preserving all unmasked address bits; no assignment or routing semantics.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
