import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  items: readonly string[];
  labels: readonly string[];
  capacities: readonly number[];
  seed: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "items", label: "items", kind: "stringList" },
  { id: "labels", label: "labels", kind: "stringList" },
  { id: "capacities", label: "capacities", kind: "numberList" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.uniqueIds(i.items);
  H.uniqueIds(i.labels);
  H.check(i.labels.length === i.capacities.length);
  i.capacities.forEach((x) => H.int(x, 0, 128));
  H.check(
    i.capacities.reduce((s, x) => s + x, 0) === i.items.length &&
      i.items.length > 1,
  );
  let p = 0;
  const offsets = i.capacities.map((x) => {
      const r = p;
      p += x;
      return r;
    }),
    shuffled = H.shuffle(i.items, random);
  return H.finish({
    seed: i.seed,
    assignments: i.labels.map((label, j) => ({
      label,
      items: shuffled.slice(offsets[j], offsets[j] + i.capacities[j]),
    })),
  });
};
export const example = {
  input: {
    items: ["a", "b", "c"],
    labels: ["x", "y"],
    capacities: [1, 2],
    seed: "batch56",
  },
  output: {
    result: {
      seed: "batch56",
      assignments: [
        { label: "x", items: ["b"] },
        { label: "y", items: ["c", "a"] },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/labeled-capacity-slot-deal",
  title: "Random Labeled Capacity Slot Deal",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Uniform labeled slot permutation for explicit capacities whose sum equals the unique item count; within-group slot order is retained.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
