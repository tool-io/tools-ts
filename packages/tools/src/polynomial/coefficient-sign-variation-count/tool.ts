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
  const p = i.coefficients.filter((x) => x !== 0);
  return H.finish({
    variations: p.slice(1).filter((x, j) => Math.sign(x) !== Math.sign(p[j]))
      .length,
  });
};
export const example = {
  input: { coefficients: [1, 0, -2, 3] },
  output: { result: { variations: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "polynomial/coefficient-sign-variation-count",
  title: "Polynomial Coefficient Sign Variation Count",
  description:
    "Count polynomial coefficient sign variations ignoring exact zeros in ascending order; this is algebraic evidence, not an exact positive-root count.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
