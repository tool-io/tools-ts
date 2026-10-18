import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  bar: number;
  beat: number;
  tick: number;
  ticksPerBeat: number;
  beatsPerBar: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bar", kind: "integer", label: "bar" },
  { id: "beat", kind: "integer", label: "beat" },
  { id: "tick", kind: "integer", label: "tick" },
  { id: "ticksPerBeat", kind: "integer", label: "ticksPerBeat" },
  { id: "beatsPerBar", kind: "integer", label: "beatsPerBar" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.bar);
  H.int(i.ticksPerBeat, 1);
  H.int(i.beatsPerBar, 1, 128);
  H.int(i.beat, 0, i.beatsPerBar - 1);
  H.int(i.tick, 0, i.ticksPerBeat - 1);
  return H.finish({
    tick: (i.bar * i.beatsPerBar + i.beat) * i.ticksPerBeat + i.tick,
  });
};
export const example = {
  input: { bar: 1, beat: 0, tick: 7, ticksPerBeat: 24, beatsPerBar: 4 },
  output: { result: { tick: 103 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/bar-beat-tick-linear-position",
  title: "Bar Beat Tick Linear Position",
  description:
    "Join validated zero-based bar/beat/tick components to a linear integer musical position; explicit meter and tick resolution.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { tick: { type: "number" } },
        required: ["tick"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
