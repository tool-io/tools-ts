import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ wildcard: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "wildcard", kind: "string", label: "wildcard" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const w = H.ip(i.wildcard, 32),
    contiguous = (w & (w + 1n)) === 0n;
  return H.finish({
    contiguous,
    prefix: contiguous ? 32 - (w === 0n ? 0 : w.toString(2).length) : null,
  });
};
export const example = {
  input: { wildcard: "0.0.0.255" },
  output: { result: { contiguous: true, prefix: 24 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-wildcard-contiguity-audit",
  title: "IPv4 Wildcard Mask Contiguity Audit",
  description:
    "Audit whether an IPv4 wildcard is all trailing one bits and report its equivalent prefix; noncontiguous wildcard masks remain valid patterns but not CIDR masks.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
