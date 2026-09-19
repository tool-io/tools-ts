import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  items: readonly string[];
  history: readonly string[];
  cooldown: number;
  seed: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "items", label: "items", kind: "stringList" },
  { id: "history", label: "history", kind: "stringList" },
  { id: "cooldown", label: "cooldown", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.uniqueIds(i.items);
  H.int(i.cooldown, 0, 128);
  const recent = i.cooldown ? i.history.slice(-i.cooldown) : [],
    eligible = i.items.filter((x) => !recent.includes(x));
  H.check(eligible.length > 0);
  return H.finish({
    seed: i.seed,
    item: eligible[H.randint(0, eligible.length - 1, random)],
    eligible,
  });
};
export const example = {
  input: {
    items: ["a", "b", "c"],
    history: ["a", "b"],
    cooldown: 1,
    seed: "batch56",
  },
  output: { result: { seed: "batch56", item: "a", eligible: ["a", "c"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/cooldown-history-next-pick",
  title: "Random Cooldown History Next Pick",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Uniformly choose a unique item ID excluding the last K caller history IDs; empty feasible support rejects instead of falling back.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
