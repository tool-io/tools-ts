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
  const rank = H.permRank(i.permutation),
    r = rank + 1n;
  return H.finish({
    permutation:
      r >= 0n && r < H.factorial(i.permutation.length)
        ? H.permUnrank(i.permutation.length, r)
        : null,
  });
};
export const example = {
  input: { permutation: [1, 0, 2] },
  output: { result: { permutation: [1, 2, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "permutation/permutation-next-lexicographic",
  title: "Next Lexicographic Permutation",
  description:
    "Return the next lexicographic index permutation without wraparound; null marks the boundary of the permutation order.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
