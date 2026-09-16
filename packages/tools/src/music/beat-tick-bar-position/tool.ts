import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  tick: number;
  ticksPerBeat: number;
  beatsPerBar: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tick", kind: "integer", label: "tick" },
  { id: "ticksPerBeat", kind: "integer", label: "ticksPerBeat" },
  { id: "beatsPerBar", kind: "integer", label: "beatsPerBar" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.tick);
  H.int(i.ticksPerBeat, 1);
  H.int(i.beatsPerBar, 1, 128);
  const barTicks = i.ticksPerBeat * i.beatsPerBar;
  return H.finish({
    bar: Math.floor(i.tick / barTicks),
    beat: Math.floor(i.tick / i.ticksPerBeat) % i.beatsPerBar,
    tick: i.tick % i.ticksPerBeat,
  });
};
export const example = {
  input: { tick: 103, ticksPerBeat: 24, beatsPerBar: 4 },
  output: { result: { bar: 1, beat: 0, tick: 7 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/beat-tick-bar-position",
  title: "Beat Tick Bar Position",
  description:
    "Split nonnegative linear musical ticks into zero-based bar, beat and residual tick using explicit grid dimensions.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
