import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  tickets: readonly string[];
  used: readonly string[];
  count: number;
  seed: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tickets", label: "tickets", kind: "stringList" },
  { id: "used", label: "used", kind: "stringList" },
  { id: "count", label: "count", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.uniqueIds(i.tickets);
  H.uniqueIds(i.used);
  H.check(i.used.every((x) => i.tickets.includes(x)));
  const eligible = i.tickets.filter((x) => !i.used.includes(x));
  H.int(i.count, 1, eligible.length);
  const positions = H.choosePositions(eligible.length, i.count, random);
  return H.finish({
    seed: i.seed,
    drawn: positions.map((j) => eligible[j]),
    remaining: eligible.filter((_, j) => !positions.includes(j)),
  });
};
export const example = {
  input: { tickets: ["a", "b", "c"], used: ["b"], count: 1, seed: "batch56" },
  output: { result: { seed: "batch56", drawn: ["a"], remaining: ["c"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/remaining-ticket-draw",
  title: "Random Remaining Ticket Draw",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Draw uniform remaining unique ticket IDs without replacement after explicit used membership; infeasible counts reject, no persistent history.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
