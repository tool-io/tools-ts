import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  bits: number;
  fractionalBits: number;
  signed: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bits", kind: "integer", label: "bits" },
  { id: "fractionalBits", kind: "integer", label: "fractionalBits" },
  { id: "signed", kind: "boolean", label: "signed" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.bits, 1, 128);
  H.int(i.fractionalBits, 0, 128);
  const min = i.signed ? -(1n << BigInt(i.bits - 1)) : 0n,
    max = (1n << BigInt(i.bits - (i.signed ? 1 : 0))) - 1n,
    denominator = String(1n << BigInt(i.fractionalBits));
  return H.finish({
    minimum: { numerator: String(min), denominator },
    maximum: { numerator: String(max), denominator },
  });
};
export const example = {
  input: { bits: 4, fractionalBits: 2, signed: true },
  output: {
    result: {
      minimum: { numerator: "-8", denominator: "4" },
      maximum: { numerator: "7", denominator: "4" },
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/fixed-point-range-envelope",
  title: "Fixed Point Range Envelope",
  description:
    "Report the exact representable rational envelope of a signed or unsigned binary fixed-point word; no floating approximation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
