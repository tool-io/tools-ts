import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ bytes: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bytes", label: "bytes", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.bytes(i.bytes);
  return H.finish({
    starts: i.bytes[0] === 240,
    ends: i.bytes.at(-1) === 247,
    interiorData:
      i.bytes.length >= 2 && i.bytes.slice(1, -1).every((x) => x < 128),
    valid:
      i.bytes.length >= 2 &&
      i.bytes[0] === 240 &&
      i.bytes.at(-1) === 247 &&
      i.bytes.slice(1, -1).every((x) => x < 128),
  });
};
export const example = {
  input: { bytes: [240, 1, 2, 247] },
  output: {
    result: { starts: true, ends: true, interiorData: true, valid: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["MIDI System Exclusive Byte Envelope Audit", "MIDI", "music"],
    collections: ["encode-decode"],
    fields: ["MIDI", "music"],
    keywords: ["MIDI", "music"],
  },
  id: "midi/system-exclusive-byte-envelope-audit",
  title: "MIDI System Exclusive Byte Envelope Audit",
  description:
    "Audit a complete uninterleaved MIDI SysEx byte envelope F0 data F7; manufacturer identity, universal messages and realtime interleaving are not parsed.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          starts: { type: "boolean" },
          ends: { type: "boolean" },
          interiorData: { type: "boolean" },
          valid: { type: "boolean" },
        },
        required: ["starts", "ends", "interiorData", "valid"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
