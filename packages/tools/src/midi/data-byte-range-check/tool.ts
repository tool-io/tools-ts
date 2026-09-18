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
    valid: i.bytes.every((x) => x < 128),
    violations: i.bytes.flatMap((x, index) =>
      x >= 128 ? [{ index, value: x }] : [],
    ),
  });
};
export const example = {
  input: { bytes: [0, 127, 128] },
  output: { result: { valid: false, violations: [{ index: 2, value: 128 }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "midi/data-byte-range-check",
  title: "MIDI Data Byte Range Check",
  description:
    "Audit explicit raw byte values for MIDI seven-bit data-byte eligibility, retaining status-bit violations instead of interpreting them as messages.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
