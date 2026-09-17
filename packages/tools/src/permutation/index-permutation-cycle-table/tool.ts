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
  return H.finish({ cycles: H.cycles(i.permutation) });
};
export const example = {
  input: { permutation: [1, 0, 2] },
  output: { result: { cycles: [[0, 1], [2]] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "permutation/index-permutation-cycle-table",
  title: "Index Permutation Cycle Table",
  description:
    "Decompose an index permutation into disjoint cycles, including fixed points and starting each cycle at its smallest unseen index.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
