import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  messagesJson: string;
  programs: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "messagesJson", label: "messagesJson", kind: "string" },
  { id: "programs", label: "programs", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.midiRecords(i.messagesJson);
  i.programs.forEach((x) => H.int(x, 0, 127));
  return H.finish({
    messages: r.filter(
      (v) => v.status >> 4 === 12 && i.programs.includes(v.data[0]),
    ),
  });
};
export const example = {
  input: {
    messagesJson: '[{"status":192,"data":[10]},{"status":193,"data":[11]}]',
    programs: [10],
  },
  output: { result: { messages: [{ status: 192, data: [10] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "midi/channel-message-program-selector",
  title: "MIDI Channel Message Program Selector",
  description:
    "Select MIDI program-change records by explicit zero-based program numbers; no General MIDI instrument-name or bank-selection model.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
