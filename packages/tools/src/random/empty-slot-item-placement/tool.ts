import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  items: readonly string[];
  slots: number;
  occupied: readonly number[];
  seed: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "items", label: "items", kind: "stringList" },
  { id: "slots", label: "slots", kind: "integer" },
  { id: "occupied", label: "occupied", kind: "numberList" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.uniqueIds(i.items);
  H.int(i.slots, 1, 128);
  i.occupied.forEach((x) => H.int(x, 0, i.slots - 1));
  H.check(
    H.unique(i.occupied).length === i.occupied.length && i.items.length > 0,
  );
  const free = Array.from({ length: i.slots }, (_, j) => j).filter(
      (j) => !i.occupied.includes(j),
    ),
    chosen = H.choosePositions(free.length, i.items.length, random).map(
      (j) => free[j],
    );
  return H.finish({
    seed: i.seed,
    placements: i.items.map((item, j) => ({ item, slot: chosen[j] })),
  });
};
export const example = {
  input: { items: ["a", "b"], slots: 4, occupied: [1], seed: "batch56" },
  output: {
    result: {
      seed: "batch56",
      placements: [
        { item: "a", slot: 0 },
        { item: "b", slot: 2 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/empty-slot-item-placement",
  title: "Random Empty Slot Item Placement",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Assign unique supplied item IDs to distinct currently empty integer slots without replacement; report actual slot IDs, preserve occupied slots.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
