import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  integer: string;
  bits: number;
  signed: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "integer", kind: "string", label: "integer" },
  { id: "bits", kind: "integer", label: "bits" },
  { id: "signed", kind: "boolean", label: "signed" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.bits, 1, 128);
  const v = H.bigint(i.integer),
    min = i.signed ? -(1n << BigInt(i.bits - 1)) : 0n,
    max = (1n << BigInt(i.bits - (i.signed ? 1 : 0))) - 1n;
  return H.finish({
    integer: String(v < min ? min : v > max ? max : v),
    saturated: v < min || v > max,
  });
};
export const example = {
  input: { integer: "20", bits: 4, signed: true },
  output: { result: { integer: "7", saturated: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/fixed-point-saturation-result",
  title: "Fixed Point Saturation Result",
  description:
    "Saturate an exact fixed-point raw integer to an explicit word range, retaining whether clipping occurred.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
