import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  left: string;
  right: string;
  fractionalBits: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", kind: "string", label: "left" },
  { id: "right", kind: "string", label: "right" },
  { id: "fractionalBits", kind: "integer", label: "fractionalBits" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.fractionalBits, 0, 128);
  const a = H.bigint(i.left),
    b = H.bigint(i.right),
    scale = 1n << BigInt(i.fractionalBits);
  H.check(b !== 0n);
  const numerator = a * scale,
    denominator = b;
  return H.finish({
    integer: String(numerator / denominator),
    remainder: String(numerator % denominator),
    divisor: String(denominator),
  });
};
export const example = {
  input: { left: "6", right: "3", fractionalBits: 2 },
  output: { result: { integer: "8", remainder: "0", divisor: "3" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/fixed-point-division-rescale",
  title: "Fixed Point Division and Rescale",
  description:
    "Exact raw fixed-point division and rescaling, truncating toward zero while retaining signed remainder evidence.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
