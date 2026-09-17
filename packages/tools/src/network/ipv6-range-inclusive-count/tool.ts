import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ start: string; end: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "start", kind: "string", label: "start" },
  { id: "end", kind: "string", label: "end" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const [a, b] = H.ipRange(i.start, i.end, 128);
  return H.finish({ count: String(b - a + 1n) });
};
export const example = {
  input: { start: "::", end: "::3" },
  output: { result: { count: "4" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv6-range-inclusive-count",
  title: "IPv6 Range Inclusive Count",
  description:
    "Count every IPv6 address in an arbitrary ordered inclusive range using exact integer text, not a subnet-only address count.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
