import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ lsb: number; msb: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "lsb", label: "lsb", kind: "integer" },
  { id: "msb", label: "msb", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.lsb, 0, 127);
  H.int(i.msb, 0, 127);
  return H.finish({ value: i.lsb + 128 * i.msb });
};
export const example = {
  input: { lsb: 1, msb: 64 },
  output: { result: { value: 8193 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "midi/seven-bit-pair-fourteen-bit-join",
  title: "MIDI Seven Bit Pair Fourteen Bit Join",
  description:
    "Join MIDI least-significant then most-significant seven-bit data bytes into an unsigned fourteen-bit integer.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
