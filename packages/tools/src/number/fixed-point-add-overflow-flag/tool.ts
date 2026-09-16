import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  left: string;
  right: string;
  bits: number;
  signed: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", kind: "string", label: "left" },
  { id: "right", kind: "string", label: "right" },
  { id: "bits", kind: "integer", label: "bits" },
  { id: "signed", kind: "boolean", label: "signed" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.bits, 1, 128);
  const sum = H.bigint(i.left) + H.bigint(i.right),
    min = i.signed ? -(1n << BigInt(i.bits - 1)) : 0n,
    max = (1n << BigInt(i.bits - (i.signed ? 1 : 0))) - 1n;
  return H.finish({ sum: String(sum), overflow: sum < min || sum > max });
};
export const example = {
  input: { left: "7", right: "1", bits: 4, signed: true },
  output: { result: { sum: "8", overflow: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/fixed-point-add-overflow-flag",
  title: "Fixed Point Add Overflow Flag",
  description:
    "Add exact raw fixed-point integers and flag explicit signed or unsigned word overflow; does not wrap or saturate.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
