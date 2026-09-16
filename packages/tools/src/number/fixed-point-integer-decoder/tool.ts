import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ integer: string; fractionalBits: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "integer", kind: "string", label: "integer" },
  { id: "fractionalBits", kind: "integer", label: "fractionalBits" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.fractionalBits, 0, 128);
  const n = H.bigint(i.integer);
  return H.finish({
    decimal: H.decimalText(
      n * 5n ** BigInt(i.fractionalBits),
      i.fractionalBits,
    ),
  });
};
export const example = {
  input: { integer: "-3", fractionalBits: 2 },
  output: { result: { decimal: "-0.75" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/fixed-point-integer-decoder",
  title: "Fixed Point Integer Decoder",
  description:
    "Decode an exact binary fixed-point integer to terminating decimal text with explicit fractional bit count.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
