import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ values: readonly string[]; seed: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "values", kind: "stringList" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
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
      start: 0,
      direction: -1,
      sourceIndexes: [0, 2, 1],
      values: ["a", "c", "b"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/ring-start-direction",
  title: "Random Ring Start and Direction",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Choose independent uniform ring start and either traversal direction, preserving cyclic adjacency; support is start/direction assignments, not unique rendered sequences.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
