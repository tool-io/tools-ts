import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ address: string; index: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "address", kind: "string", label: "address" },
  { id: "index", kind: "integer", label: "index" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.index, 0, 7);
  const v = H.ip(i.address, 128);
  return H.finish({
    value: Number((v >> BigInt(16 * (7 - i.index))) & 65535n),
  });
};
export const example = {
  input: { address: "::abcd", index: 7 },
  output: { result: { value: 43981 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv6-hextet-field-extractor",
  title: "IPv6 Hextet Field Extractor",
  description:
    "Extract one zero-based IPv6 hextet in network order after existing address parsing; returns its exact 16-bit numeric value.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
