import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  coefficients: readonly number[];
  degree: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "coefficients", label: "coefficients", kind: "numberList" },
  { id: "degree", label: "degree", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.coefficients.length > 0);
  H.int(i.degree, 0, 127);
  return H.finish({
    coefficients: [
      ...i.coefficients,
      ...Array(Math.max(0, i.degree + 1 - i.coefficients.length)).fill(0),
    ],
  });
};
export const example = {
  input: { coefficients: [1, 2, 0, 0], degree: 5 },
  output: { result: { coefficients: [1, 2, 0, 0, 0, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "polynomial/coefficient-power-padding",
  title: "Polynomial Coefficient Power Padding",
  description:
    "Pad high powers of an ascending coefficient list to at least an explicit degree without truncating existing high powers; bounded vector output.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
