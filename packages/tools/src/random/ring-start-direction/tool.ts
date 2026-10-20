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
  const start = H.randint(0, i.values.length - 1, random),
    direction = H.randint(0, 1, random) ? 1 : -1,
    order = i.values.map((_, j) =>
      H.mod(start + direction * j, i.values.length),
    );
  return H.finish({
    seed: i.seed,
    start,
    direction,
    sourceIndexes: order,
    values: order.map((j) => i.values[j]),
  });
};
export const example = {
  input: { values: ["a", "b", "c"], seed: "batch56" },
  output: {
    result: {
      seed: "batch56",
      start: 1,
      direction: 1,
      sourceIndexes: [1, 2, 0],
      values: ["b", "c", "a"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Random Ring Start and Direction", "random generation"],
    collections: ["data", "learn"],
    fields: ["random", "random generation"],
    keywords: ["random generation"],
  },
  id: "random/ring-start-direction",
  title: "Random Ring Start and Direction",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Choose independent uniform ring start and either traversal direction, preserving cyclic adjacency; support is start/direction assignments, not unique rendered sequences.",
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
          start: { type: "number" },
          direction: { type: "number" },
          sourceIndexes: { type: "array", items: { type: "number" } },
          values: { type: "array", items: { type: "string" } },
        },
        required: ["seed", "start", "direction", "sourceIndexes", "values"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
