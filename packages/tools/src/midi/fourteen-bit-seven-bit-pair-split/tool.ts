import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ value: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", label: "value", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.value, 0, 16383);
  return H.finish({ lsb: i.value % 128, msb: Math.floor(i.value / 128) });
};
export const example = {
  input: { value: 8193 },
  output: { result: { lsb: 1, msb: 64 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "midi/fourteen-bit-seven-bit-pair-split",
  title: "MIDI Fourteen Bit Seven Bit Pair Split",
  description:
    "Split an unsigned MIDI fourteen-bit value into its least-significant and most-significant seven-bit data bytes.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
