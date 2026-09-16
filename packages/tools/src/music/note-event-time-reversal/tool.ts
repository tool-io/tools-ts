import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ eventsJson: string; window: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "eventsJson", kind: "string", label: "eventsJson" },
  { id: "window", kind: "integer", label: "window" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.records(i.eventsJson).map((v) => ({
    start: H.int(H.num(v.start)),
    duration: H.int(H.num(v.duration)),
    pitch: H.int(H.num(v.pitch), 0, 127),
    channel: H.int(H.num(v.channel), 0, 15),
  }));
  H.int(i.window);
  H.check(r.every((v) => v.start + v.duration <= i.window));
  return H.finish({
    events: r.map((v) => ({ ...v, start: i.window - v.start - v.duration })),
  });
};
export const example = {
  input: {
    eventsJson: '[{"start":1,"duration":3,"pitch":60,"channel":0}]',
    window: 10,
  },
  output: {
    result: { events: [{ start: 6, duration: 3, pitch: 60, channel: 0 }] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/note-event-time-reversal",
  title: "Note Event Time Reversal",
  description:
    "Reverse note intervals within an explicit tick window, preserving durations and caller order; all events must fit.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
