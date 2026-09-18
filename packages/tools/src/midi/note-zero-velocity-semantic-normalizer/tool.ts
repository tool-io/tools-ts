import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ messagesJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "messagesJson", label: "messagesJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.midiRecords(i.messagesJson);
  return H.finish({
    messages: r.map((v) =>
      v.status >> 4 === 9 && v.data[1] === 0
        ? { status: 128 + (v.status & 15), data: [v.data[0], 0] }
        : v,
    ),
  });
};
export const example = {
  input: { messagesJson: '[{"status":146,"data":[60,0]}]' },
  output: { result: { messages: [{ status: 130, data: [60, 0] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "midi/note-zero-velocity-semantic-normalizer",
  title: "MIDI Note Zero Velocity Semantic Normalizer",
  description:
    "Normalize MIDI note-on with zero velocity to an explicit note-off with zero release velocity; other channel records are preserved.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
