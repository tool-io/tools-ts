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
  return H.finish({ rank: String(H.permRank(i.permutation)) });
};
export const example = {
  input: { permutation: [2, 0, 1] },
  output: { result: { rank: "4" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "permutation/permutation-lexicographic-rank",
  title: "Permutation Lexicographic Rank",
  description:
    "Return a zero-based exact lexicographic permutation rank as decimal integer text; no floating factorial approximation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
