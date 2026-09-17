import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ address: string; bits: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "address", kind: "string", label: "address" },
  { id: "bits", kind: "integer", label: "bits" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.bits, 0, 128);
  return H.finish({
    value: String(H.ip(i.address, 128) & ((1n << BigInt(i.bits)) - 1n)),
  });
};
export const example = {
  input: { address: "::abcd", bits: 8 },
  output: { result: { value: "205" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv6-low-bit-field-extractor",
  title: "IPv6 Low Bit Field Extractor",
  description:
    "Extract an explicitly sized low-bit IPv6 field as decimal integer text, including zero-width zero; no interface-identifier semantics inferred.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
