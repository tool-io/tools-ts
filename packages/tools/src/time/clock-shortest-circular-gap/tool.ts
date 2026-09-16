import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ from: number; to: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "from", kind: "integer", label: "from" },
  { id: "to", kind: "integer", label: "to" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.clock(i.from);
  H.clock(i.to);
  const forward = H.mod(i.to - i.from, 86400);
  return H.finish({
    gap: Math.min(forward, 86400 - forward),
    signedGap: forward <= 43200 ? forward : forward - 86400,
  });
};
export const example = {
  input: { from: 86390, to: 10 },
  output: { result: { gap: 20, signedGap: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "time/clock-shortest-circular-gap",
  title: "Clock Shortest Circular Gap",
  description:
    "Compute shortest signed circular clock gap, half-day ties forward on a fixed 86,400-second day; equal clocks give zero.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
