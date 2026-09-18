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
    terms: i.coefficients.flatMap((coefficient, power) =>
      coefficient === 0 ? [] : [{ power, coefficient }],
    ),
  });
};
export const example = {
  input: { coefficients: [1, 0, 3] },
  output: {
    result: {
      terms: [
        { power: 0, coefficient: 1 },
        { power: 2, coefficient: 3 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "polynomial/coefficient-sparse-power-pairs",
  title: "Polynomial Sparse Power Pair Extractor",
  description:
    "Extract nonzero ascending polynomial power/coefficient records; explicit zero powers are intentionally omitted and exact equality is used.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
