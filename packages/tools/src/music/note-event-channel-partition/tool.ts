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
    start: H.int(H.num(v.start)),
    duration: H.int(H.num(v.duration)),
    pitch: H.int(H.num(v.pitch), 0, 127),
    channel: H.int(H.num(v.channel), 0, 15),
  }));
  return H.finish({
    channels: H.groups(r, (v) => String(v.channel)).map((g) => ({
      channel: Number(g.key),
      events: g.indexes.map((j) => r[j]),
    })),
  });
};
export const example = {
  input: { eventsJson: '[{"start":1,"duration":3,"pitch":60,"channel":0}]' },
  output: {
    result: {
      channels: [
        {
          channel: 0,
          events: [{ start: 1, duration: 3, pitch: 60, channel: 0 }],
        },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/note-event-channel-partition",
  title: "Note Event Channel Partition",
  description:
    "Partition explicit note events by channel in first-appearance order while retaining event order and numerical evidence.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
