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
  const [a, b] = H.ipRange(i.start, i.end, 32);
  return H.finish({ count: String(b - a + 1n) });
};
export const example = {
  input: { start: "0.0.0.0", end: "255.255.255.255" },
  output: { result: { count: "4294967296" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-range-address-count",
  title: "IPv4 Range Address Count",
  description:
    "Count every address in an arbitrary inclusive IPv4 range, not a prefix\u2019s usable-host count; entire 32-bit space remains exact.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
