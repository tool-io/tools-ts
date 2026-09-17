import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ permutation: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "permutation", kind: "numberList", label: "permutation" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.permutation(i.permutation);
  return H.finish({
    fixedPoints: i.permutation.flatMap((x, j) => (x === j ? [j] : [])),
  });
};
export const example = {
  input: { permutation: [1, 0, 2] },
  output: { result: { fixedPoints: [2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "permutation/index-permutation-fixed-points",
  title: "Index Permutation Fixed Points",
  description:
    "List all fixed input indexes of a validated complete permutation in ascending original order.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
