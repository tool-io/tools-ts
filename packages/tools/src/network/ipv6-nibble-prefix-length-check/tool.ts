import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ prefix: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "prefix", kind: "integer", label: "prefix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.prefix, 0, 128);
  return H.finish({
    nibbleAligned: i.prefix % 4 === 0,
    labels: i.prefix % 4 === 0 ? i.prefix / 4 : null,
  });
};
export const example = {
  input: { prefix: 64 },
  output: { result: { nibbleAligned: true, labels: 16 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv6-nibble-prefix-length-check",
  title: "IPv6 Nibble Prefix Length Check",
  description:
    "Check IPv6 prefix alignment for whole-nibble reverse-zone labels; nonaligned prefixes do not imply a simple reverse-zone delegation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
