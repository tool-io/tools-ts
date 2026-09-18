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
  H.check(i.coefficients.length > 0);
  return H.finish({
    coefficients: i.coefficients.map((x, j) => (j % 2 ? -x : x)),
  });
};
export const example = {
  input: { coefficients: [1, 2, 3, 4] },
  output: { result: { coefficients: [1, -2, 3, -4] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "polynomial/coefficient-input-negation",
  title: "Polynomial Input Negation Transform",
  description:
    "Transform ascending coefficients from p(x) to p(-x), flipping odd powers only and preserving stored zeros.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
