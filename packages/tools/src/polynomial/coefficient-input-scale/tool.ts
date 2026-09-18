import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  coefficients: readonly number[];
  scale: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "coefficients", label: "coefficients", kind: "numberList" },
  { id: "scale", label: "scale", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.coefficients.length > 0);
  return H.finish({
    coefficients: i.coefficients.map((x, j) => x * i.scale ** j),
  });
};
export const example = {
  input: { coefficients: [1, 2, 3], scale: 2 },
  output: { result: { coefficients: [1, 4, 12] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "polynomial/coefficient-input-scale",
  title: "Polynomial Input Scale Transform",
  description:
    "Transform ascending coefficients from p(x) to p(scale*x); differs from output scaling and retains explicit high-power zero coefficients.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
