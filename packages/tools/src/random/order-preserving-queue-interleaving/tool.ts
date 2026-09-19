import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ queuesJson: string; seed: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "queuesJson", label: "queuesJson", kind: "string" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  const q = H.buckets(i.queuesJson),
    positions = q.map(() => 0),
    output: { queue: number; position: number; value: string }[] = [];
  H.check(q.flat().length > 0 && q.flat().length <= 128);
  while (output.length < q.flat().length) {
    const remaining = q.map((v, j) => v.length - positions[j]),
      queue = H.weightedChoice(remaining, random),
      position = positions[queue]++;
    output.push({ queue, position, value: q[queue][position] });
  }
  return H.finish({ seed: i.seed, output });
};
export const example = {
  input: { queuesJson: '[["a","b"],["c"]]', seed: "batch56" },
  output: {
    result: {
      seed: "batch56",
      output: [
        { queue: 0, position: 0, value: "a" },
        { queue: 0, position: 1, value: "b" },
        { queue: 1, position: 0, value: "c" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/order-preserving-queue-interleaving",
  title: "Random Order-Preserving Queue Interleaving",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Sample uniformly over order-preserving queue-identity interleavings by choosing next queue proportional to remaining item count; unequal queue lengths are not equal-weight queues.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
