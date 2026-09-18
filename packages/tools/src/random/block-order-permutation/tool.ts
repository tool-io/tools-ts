import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ blocksJson: string; seed: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "blocksJson", label: "blocksJson", kind: "string" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  const blocks = H.buckets(i.blocksJson);
  H.check(blocks.length > 1);
  const order = H.shuffle(
    blocks.map((_, j) => j),
    random,
  );
  return H.finish({
    seed: i.seed,
    blockOrder: order,
    blocks: order.map((j) => blocks[j]),
  });
};
export const example = {
  input: { blocksJson: '[["a","b"],["c"]]', seed: "batch56" },
  output: {
    result: {
      seed: "batch56",
      blockOrder: [1, 0],
      blocks: [["c"], ["a", "b"]],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/block-order-permutation",
  title: "Random Block Order Permutation",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Uniform whole-block position permutation preserving internal order and duplicate display labels.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
