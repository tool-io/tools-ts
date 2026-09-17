import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ indexes: readonly number[]; size: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "indexes", kind: "numberList", label: "indexes" },
  { id: "size", kind: "integer", label: "size" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.combo(i.indexes, i.size);
  return H.finish({ rank: String(H.comboRank(i.indexes, i.size)) });
};
export const example = {
  input: { indexes: [0, 2], size: 4 },
  output: { result: { rank: "1" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/combination-lexicographic-rank",
  title: "Combination Lexicographic Rank",
  description:
    "Exact zero-based lexicographic combination ranking on bounded sorted distinct indexes; results are integer text or explicit index witnesses.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
