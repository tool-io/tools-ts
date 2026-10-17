import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ status: number; data: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "status", label: "status", kind: "integer" },
  { id: "data", label: "data", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(i.data.length === H.midiCount(i.status));
  i.data.forEach((x) => H.int(x, 0, 127));
  return H.finish({ bytes: [i.status, ...i.data] });
};
export const example = {
  input: { status: 146, data: [60, 100] },
  output: { result: { bytes: [146, 60, 100] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["MIDI Channel Message Record Formatter", "MIDI", "music"],
    collections: ["encode-decode"],
    fields: ["MIDI", "music"],
    keywords: ["MIDI", "music"],
  },
  id: "midi/channel-message-record-formatter",
  title: "MIDI Channel Message Record Formatter",
  description:
    "Format exactly one MIDI channel-message byte record with explicit status and validated seven-bit data arity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { bytes: { type: "array", items: { type: "number" } } },
        required: ["bytes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
