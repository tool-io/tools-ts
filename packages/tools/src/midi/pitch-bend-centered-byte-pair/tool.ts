import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ centered: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "centered", label: "centered", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.centered, -8192, 8191);
  return H.finish({
    lsb: (i.centered + 8192) % 128,
    msb: Math.floor((i.centered + 8192) / 128),
  });
};
export const example = {
  input: { centered: -8192 },
  output: { result: { lsb: 0, msb: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "midi/pitch-bend-centered-byte-pair",
  title: "MIDI Pitch Bend Centered Byte Pair",
  description:
    "Encode a signed centered MIDI pitch-bend integer to least/most-significant seven-bit data bytes; no bend-range assumption.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
