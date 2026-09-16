import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ fractionalBits: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fractionalBits", kind: "integer", label: "fractionalBits" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.fractionalBits, 0, 128);
  return H.finish({
    numerator: "1",
    denominator: String(1n << BigInt(i.fractionalBits)),
  });
};
export const example = {
  input: { fractionalBits: 3 },
  output: { result: { numerator: "1", denominator: "8" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/binary-fraction-grid-step",
  title: "Binary Fraction Grid Step",
  description:
    "Return an exact binary fraction grid step as integer strings, including the unit step at zero fractional bits.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
