import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  eventsJson: string;
  numerator: number;
  denominator: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "eventsJson", kind: "string", label: "eventsJson" },
  { id: "numerator", kind: "integer", label: "numerator" },
  { id: "denominator", kind: "integer", label: "denominator" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.records(i.eventsJson).map((v) => ({
    start: H.int(H.num(v.start)),
    duration: H.int(H.num(v.duration)),
    pitch: H.int(H.num(v.pitch), 0, 127),
    channel: H.int(H.num(v.channel), 0, 15),
  }));
  H.int(i.numerator, 0, 1e6);
  H.int(i.denominator, 1, 1e6);
  return H.finish({
    events: r.map((v) => ({
      ...v,
      duration: (v.duration * i.numerator) / i.denominator,
    })),
  });
};
export const example = {
  input: {
    eventsJson: '[{"start":1,"duration":3,"pitch":60,"channel":0}]',
    numerator: 2,
    denominator: 1,
  },
  output: {
    result: { events: [{ start: 1, duration: 6, pitch: 60, channel: 0 }] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/note-event-duration-scaler",
  title: "Note Event Duration Scaler",
  description:
    "Scale note durations by an explicit rational factor while preserving starts, pitch and channel; fractional ticks are allowed and not rounded.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
