import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ messagesJson: string; semitones: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "messagesJson", label: "messagesJson", kind: "string" },
  { id: "semitones", label: "semitones", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.midiRecords(i.messagesJson);
  H.int(i.semitones, -127, 127);
  return H.finish({
    messages: r.map((v) => {
      if (![8, 9, 10].includes(v.status >> 4)) return v;
      const note = v.data[0] + i.semitones;
      H.int(note, 0, 127);
      return { status: v.status, data: [note, ...v.data.slice(1)] };
    }),
  });
};
export const example = {
  input: { messagesJson: '[{"status":144,"data":[60,100]}]', semitones: 2 },
  output: { result: { messages: [{ status: 144, data: [62, 100] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "midi/channel-message-note-transposer",
  title: "MIDI Channel Message Note Transposer",
  description:
    "Transpose MIDI note-on/off and polyphonic key-pressure note fields only, rejecting out-of-range pitches rather than clipping; other records remain unchanged.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
