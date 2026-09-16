import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ tick: number; loopTicks: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tick", kind: "integer", label: "tick" },
  { id: "loopTicks", kind: "integer", label: "loopTicks" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.tick, -1e9, 1e9);
  H.int(i.loopTicks, 1);
  const position = H.mod(i.tick, i.loopTicks);
  return H.finish({
    position,
    cycle: Math.floor(i.tick / i.loopTicks),
    phase: position / i.loopTicks,
  });
};
export const example = {
  input: { tick: -1, loopTicks: 8 },
  output: { result: { position: 7, cycle: -1, phase: 0.875 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/loop-phase-from-ticks",
  title: "Loop Phase from Ticks",
  description:
    "Locate a signed musical tick in a repeating loop, retaining cycle carry and normalized phase.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
