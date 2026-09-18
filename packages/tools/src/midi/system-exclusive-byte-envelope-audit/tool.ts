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
  id: "midi/system-exclusive-byte-envelope-audit",
  title: "MIDI System Exclusive Byte Envelope Audit",
  description:
    "Audit a complete uninterleaved MIDI SysEx byte envelope F0 data F7; manufacturer identity, universal messages and realtime interleaving are not parsed.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
