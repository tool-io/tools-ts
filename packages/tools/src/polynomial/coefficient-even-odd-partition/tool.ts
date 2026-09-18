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
    even: i.coefficients.map((x, j) => (j % 2 ? 0 : x)),
    odd: i.coefficients.map((x, j) => (j % 2 ? x : 0)),
  });
};
export const example = {
  input: { coefficients: [1, 2, 3] },
  output: { result: { even: [1, 0, 3], odd: [0, 2, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "polynomial/coefficient-even-odd-partition",
  title: "Polynomial Even Odd Power Partition",
  description:
    "Partition p(x) into same-width even-power and odd-power coefficient vectors, with p=even+odd under ascending-power convention.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
