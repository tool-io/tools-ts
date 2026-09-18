import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ status: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "status", label: "status", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    dataBytes: H.midiCount(i.status),
    totalBytes: H.midiCount(i.status) + 1,
  });
};
export const example = {
  input: { status: 192 },
  output: { result: { dataBytes: 1, totalBytes: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "midi/channel-message-byte-count",
  title: "MIDI Channel Message Byte Count",
  description:
    "Return required MIDI 1.0 channel-message byte counts from an explicit status, excluding running-status omission and system messages.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
