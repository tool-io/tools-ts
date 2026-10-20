import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  values: readonly string[];
  pinned: readonly number[];
  seed: string;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "values", label: "values", kind: "stringList" },
  { id: "pinned", label: "pinned", kind: "numberList" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext) => {
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
      sourceIndexes: [0, 1, 2],
      values: ["a", "b", "c"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Random Pinned Slot Permutation", "random generation"],
    collections: ["data", "learn"],
    fields: ["random", "random generation"],
    keywords: ["random generation"],
  },
  id: "random/pinned-slot-permutation",
  title: "Random Pinned Slot Permutation",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Uniformly permute only unpinned positions; supplied pinned source positions remain in the same output slots.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          seed: { type: "string" },
          sourceIndexes: { type: "array", items: { type: "number" } },
          values: { type: "array", items: { type: "string" } },
        },
        required: ["seed", "sourceIndexes", "values"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
