import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  values: readonly string[];
  pinned: readonly number[];
  seed: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "values", kind: "stringList" },
  { id: "pinned", label: "pinned", kind: "numberList" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  i.pinned.forEach((x) => H.int(x, 0, i.values.length - 1));
  H.check(H.unique(i.pinned).length === i.pinned.length);
  const free = i.values.map((_, j) => j).filter((j) => !i.pinned.includes(j));
  H.check(free.length > 1);
  const shuffled = H.shuffle(free, random),
    order = i.values.map((_, j) =>
      i.pinned.includes(j) ? j : shuffled[free.indexOf(j)],
    );
  return H.finish({
    seed: i.seed,
    sourceIndexes: order,
    values: order.map((j) => i.values[j]),
  });
};
export const example = {
  input: { values: ["a", "b", "c"], pinned: [1], seed: "batch56" },
  output: {
    result: {
      seed: "batch56",
      sourceIndexes: [2, 1, 0],
      values: ["c", "b", "a"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/pinned-slot-permutation",
  title: "Random Pinned Slot Permutation",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Uniformly permute only unpinned positions; supplied pinned source positions remain in the same output slots.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
