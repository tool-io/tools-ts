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
  const pairs: number[][] = [];
  for (let j = 0; j < r.length; j++)
    for (let k = j + 1; k < r.length; k++)
      if (
        r[j].pitch === r[k].pitch &&
        r[j].channel === r[k].channel &&
        Math.max(r[j].start, r[k].start) <
          Math.min(r[j].start + r[j].duration, r[k].start + r[k].duration)
      )
        pairs.push([j, k]);
  return H.finish({ overlapPairs: pairs });
};
export const example = {
  input: {
    eventsJson:
      '[{"start":0,"duration":3,"pitch":60,"channel":0},{"start":2,"duration":2,"pitch":60,"channel":0}]',
  },
  output: { result: { overlapPairs: [[0, 1]] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/note-event-overlap-audit",
  title: "Note Event Overlap Audit",
  description:
    "Audit positive temporal overlap of same-pitch same-channel note events; zero durations and touching endpoints do not overlap.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
