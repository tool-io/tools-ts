import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  address: string;
  pattern: string;
  wildcard: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "address", kind: "string", label: "address" },
  { id: "pattern", kind: "string", label: "pattern" },
  { id: "wildcard", kind: "string", label: "wildcard" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const a = H.ip(i.address, 32),
    p = H.ip(i.pattern, 32),
    w = H.ip(i.wildcard, 32),
    fixed = 4294967295n ^ w;
  return H.finish({ matches: (a & fixed) === (p & fixed) });
};
export const example = {
  input: { address: "10.1.2.3", pattern: "10.0.2.0", wildcard: "0.255.0.255" },
  output: { result: { matches: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-wildcard-mask-pattern-check",
  title: "IPv4 Wildcard Mask Pattern Check",
  description:
    "Test arbitrary IPv4 wildcard matching where one mask bits are ignored, including noncontiguous wildcards; no firewall policy or prefix assumption.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
