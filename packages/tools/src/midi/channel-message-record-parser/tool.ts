import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ bytes: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bytes", label: "bytes", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bytes(i.bytes);
  H.check(i.bytes.length > 0 && i.bytes.length === H.midiCount(i.bytes[0]) + 1);
  i.bytes.slice(1).forEach((x) => H.int(x, 0, 127));
  return H.finish({
    status: i.bytes[0],
    type: i.bytes[0] >> 4,
    channel: i.bytes[0] & 15,
    data: i.bytes.slice(1),
  });
};
export const example = {
  input: { bytes: [146, 60, 100] },
  output: { result: { status: 146, type: 9, channel: 2, data: [60, 100] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "midi/channel-message-record-parser",
  title: "MIDI Channel Message Record Parser",
  description:
    "Parse exactly one complete explicit-status MIDI channel message; running status, realtime interleaving and system messages are rejected.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
