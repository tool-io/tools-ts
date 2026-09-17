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
  const [a, b] = H.ipRange(i.start, i.end, 32),
    count = b - a + 1n;
  const power = (count & (count - 1n)) === 0n,
    aligned = power && a % count === 0n;
  return H.finish({
    singlePrefix: aligned,
    prefix: aligned ? 32 - (count.toString(2).length - 1) : null,
  });
};
export const example = {
  input: { start: "10.0.0.0", end: "10.0.0.3" },
  output: { result: { singlePrefix: true, prefix: 30 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-single-prefix-range-alignment",
  title: "IPv4 Single-Prefix Range Alignment Audit",
  description:
    "Audit whether an arbitrary inclusive IPv4 range is exactly one aligned CIDR block; power-of-two length alone is insufficient.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
