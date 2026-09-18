import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ coefficients: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "coefficients", label: "coefficients", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ coefficients: H.polynomial(i.coefficients) });
};
export const example = {
  input: { coefficients: [1, 2, 0, 0] },
  output: { result: { coefficients: [1, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "polynomial/coefficient-leading-zero-normalizer",
  title: "Polynomial Coefficient Leading Zero Normalizer",
  description:
    "Normalize leading-power zeros in ascending-power polynomial coefficients, preserving the zero polynomial as [0]; no approximate-zero pruning.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
