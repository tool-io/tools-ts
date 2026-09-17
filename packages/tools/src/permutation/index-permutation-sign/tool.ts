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
  const c = H.cycles(i.permutation);
  return H.finish({
    sign: (i.permutation.length - c.length) % 2 ? -1 : 1,
    odd: (i.permutation.length - c.length) % 2 === 1,
  });
};
export const example = {
  input: { permutation: [1, 0, 2] },
  output: { result: { sign: -1, odd: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "permutation/index-permutation-sign",
  title: "Index Permutation Sign",
  description:
    "Compute permutation parity from its disjoint-cycle count, not from numeric value signs; empty and identity permutations are even.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
