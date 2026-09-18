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
    coefficients:
      i.coefficients.length === 1
        ? [0]
        : i.coefficients.slice(1).map((x, j) => x * (j + 1)),
  });
};
export const example = {
  input: { coefficients: [1, 2, 3] },
  output: { result: { coefficients: [2, 6] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "polynomial/coefficient-derivative-list",
  title: "Polynomial Derivative Coefficient List",
  description:
    "Differentiate a nonempty ascending-power polynomial coefficient vector exactly under finite number arithmetic; constant polynomial derivative is [0].",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
