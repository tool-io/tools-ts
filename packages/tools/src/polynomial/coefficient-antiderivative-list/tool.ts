import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  coefficients: readonly number[];
  constant: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "coefficients", label: "coefficients", kind: "numberList" },
  { id: "constant", label: "constant", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.coefficients.length > 0 && i.coefficients.length < 128);
  return H.finish({
    coefficients: [i.constant, ...i.coefficients.map((x, j) => x / (j + 1))],
  });
};
export const example = {
  input: { coefficients: [2, 6], constant: 1 },
  output: { result: { coefficients: [1, 2, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "polynomial/coefficient-antiderivative-list",
  title: "Polynomial Antiderivative Coefficient List",
  description:
    "Integrate ascending-power polynomial coefficients with an explicitly supplied integration constant; bounded number arithmetic, no symbolic rational simplification.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
