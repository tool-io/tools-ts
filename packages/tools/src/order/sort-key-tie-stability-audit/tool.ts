import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  values: readonly number[];
  permutation: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", kind: "numberList", label: "values" },
  { id: "permutation", kind: "numberList", label: "permutation" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.permutation(i.permutation);
  H.check(i.values.length === i.permutation.length);
  const pairs: number[][] = [];
  for (let j = 0; j < i.permutation.length; j++)
    for (let k = j + 1; k < i.permutation.length; k++) {
      const a = i.permutation[j],
        b = i.permutation[k];
      if (i.values[a] === i.values[b] && a > b) pairs.push([a, b]);
    }
  return H.finish({ stable: pairs.length === 0, reversedTiePairs: pairs });
};
export const example = {
  input: { values: [30, 10, 10, 20], permutation: [2, 1, 3, 0] },
  output: { result: { stable: false, reversedTiePairs: [[2, 1]] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "order/sort-key-tie-stability-audit",
  title: "Sort Key Tie Stability Audit",
  description:
    "Audit only tie-order stability of an explicit numeric sort permutation, independently of whether the keys themselves are sorted.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
