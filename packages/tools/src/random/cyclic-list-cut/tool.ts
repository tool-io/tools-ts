import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ values: readonly string[]; seed: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "values", label: "values", kind: "stringList" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.check(i.values.length > 0);
  const cut = H.randint(0, i.values.length - 1, random);
  return H.finish({
    seed: i.seed,
    cut,
    values: [...i.values.slice(cut), ...i.values.slice(0, cut)],
    sourceIndexes: Array.from(
      { length: i.values.length },
      (_, j) => (j + cut) % i.values.length,
    ),
  });
};
export const example = {
  input: { values: ["a", "b", "c"], seed: "batch56" },
  output: {
    result: {
      seed: "batch56",
      cut: 1,
      values: ["b", "c", "a"],
      sourceIndexes: [1, 2, 0],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Random Cyclic List Cut", "random generation"],
    collections: ["data", "learn"],
    fields: ["random", "random generation"],
    keywords: ["random generation"],
  },
  id: "random/cyclic-list-cut",
  title: "Random Cyclic List Cut",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Choose one of N cyclic list cut positions, preserving order and original position mapping; empty lists reject.",
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
          cut: { type: "number" },
          values: { type: "array", items: { type: "string" } },
          sourceIndexes: { type: "array", items: { type: "number" } },
        },
        required: ["seed", "cut", "values", "sourceIndexes"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
