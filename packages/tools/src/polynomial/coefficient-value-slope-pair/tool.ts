import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ coefficients: readonly number[]; x: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "coefficients", label: "coefficients", kind: "numberList" },
  { id: "x", label: "x", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.coefficients.length > 0);
  return H.finish({
    value: H.polyValue(i.coefficients, i.x),
    slope: H.polyValue(
      i.coefficients.slice(1).map((v, j) => v * (j + 1)),
      i.x,
    ),
  });
};
export const example = {
  input: { coefficients: [1, 2, 3], x: 2 },
  output: { result: { value: 17, slope: 14 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "polynomial/coefficient-value-slope-pair",
  title: "Polynomial Value Slope Pair",
  description:
    "Evaluate a nonempty ascending-power polynomial and derivative at one finite x using Horner arithmetic; no root or stability claim.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
