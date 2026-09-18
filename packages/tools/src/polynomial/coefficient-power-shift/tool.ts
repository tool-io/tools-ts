import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  coefficients: readonly number[];
  shift: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "coefficients", label: "coefficients", kind: "numberList" },
  { id: "shift", label: "shift", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.shift, 0, 127);
  H.check(i.coefficients.length > 0 && i.coefficients.length + i.shift <= 128);
  return H.finish({
    coefficients: [...Array(i.shift).fill(0), ...i.coefficients],
  });
};
export const example = {
  input: { coefficients: [1, 2], shift: 2 },
  output: { result: { coefficients: [0, 0, 1, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "polynomial/coefficient-power-shift",
  title: "Polynomial Power Shift Transform",
  description:
    "Multiply an ascending coefficient polynomial by x^shift using exact zero padding; nonnegative shifts only, bounded stored vector size.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
