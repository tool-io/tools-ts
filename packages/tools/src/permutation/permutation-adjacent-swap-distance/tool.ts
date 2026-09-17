import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  first: readonly number[];
  second: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "first", kind: "numberList", label: "first" },
  { id: "second", kind: "numberList", label: "second" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.permutation(i.first);
  H.permutation(i.second);
  H.check(i.first.length === i.second.length);
  const positions = i.first.map((x) => i.second.indexOf(x));
  let distance = 0;
  positions.forEach((x, j) =>
    positions.slice(j + 1).forEach((y) => {
      if (x > y) distance++;
    }),
  );
  return H.finish({ distance });
};
export const example = {
  input: { first: [0, 1, 2], second: [2, 0, 1] },
  output: { result: { distance: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "permutation/permutation-adjacent-swap-distance",
  title: "Permutation Adjacent Swap Distance",
  description:
    "Compute the minimum adjacent-swap distance between two index permutations by relative inversion count; no arbitrary value sorting.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
