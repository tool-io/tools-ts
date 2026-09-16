import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ eventsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "eventsJson", kind: "string", label: "eventsJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.records(i.eventsJson).map((v) => ({
    time: H.int(H.num(v.time)),
    pitch: H.int(H.num(v.pitch), 0, 127),
    channel: H.int(H.num(v.channel), 0, 15),
    type: H.str(v.type),
  }));
  H.check(
    r.every(
      (v, j) =>
        (v.type === "on" || v.type === "off") &&
        (j === 0 || v.time >= r[j - 1].time),
    ),
  );
  const queues = new Map<string, number[]>(),
    pairs: Record<string, number>[] = [],
    unmatchedOff: number[] = [];
  r.forEach((v, j) => {
    const key = JSON.stringify([v.channel, v.pitch]),
      q = queues.get(key) ?? [];
    if (v.type === "on") q.push(j);
    else if (q.length) {
      const on = q.shift()!;
      pairs.push({ onIndex: on, offIndex: j, duration: v.time - r[on].time });
    } else unmatchedOff.push(j);
    queues.set(key, q);
  });
  return H.finish({
    pairs,
    unmatchedOn: [...queues.values()].flat().sort((a, b) => a - b),
    unmatchedOff,
  });
};
export const example = {
  input: {
    eventsJson:
      '[{"time":0,"pitch":60,"channel":0,"type":"on"},{"time":2,"pitch":60,"channel":0,"type":"off"}]',
  },
  output: {
    result: {
      pairs: [{ onIndex: 0, offIndex: 1, duration: 2 }],
      unmatchedOn: [],
      unmatchedOff: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/note-on-off-pairing",
  title: "Note On Off Pairing Tool",
  description:
    "Pair explicitly typed sorted note-on/off events FIFO per channel and pitch; retain unmatched events and do not infer MIDI velocity-zero semantics.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
