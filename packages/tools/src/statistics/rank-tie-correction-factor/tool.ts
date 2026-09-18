import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ values: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "values", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const n = i.values.length;
  H.check(n >= 2);
  return H.finish({
    factor:
      1 -
      H.rankBlocks(i.values).reduce((s, g) => {
        const t = g.indexes.length;
        return s + t ** 3 - t;
      }, 0) /
        (n ** 3 - n),
  });
};
export const example = {
  input: { values: [1, 1, 2, 2, 2] },
  output: { result: { factor: 0.75 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "statistics/rank-tie-correction-factor",
  title: "Rank Tie Correction Factor",
  description:
    "Compute the exact-tie cubic correction factor 1-sum(t^3-t)/(n^3-n) for n>=2; does not itself correct a named test statistic.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
