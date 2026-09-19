import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  bucketsJson: string;
  weights: readonly number[];
  seed: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bucketsJson", label: "bucketsJson", kind: "string" },
  { id: "weights", label: "weights", kind: "numberList" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  const buckets = H.buckets(i.bucketsJson);
  H.check(
    buckets.length === i.weights.length &&
      buckets.every((v, j) => v.length > 0 || i.weights[j] === 0),
  );
  const bucket = H.weightedChoice(i.weights, random),
    position = H.randint(0, buckets[bucket].length - 1, random);
  return H.finish({
    seed: i.seed,
    bucket,
    position,
    value: buckets[bucket][position],
  });
};
export const example = {
  input: { bucketsJson: '[["a","b"],["c"]]', weights: [0, 1], seed: "batch56" },
  output: { result: { seed: "batch56", bucket: 1, position: 0, value: "c" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/weighted-bucket-member-draw",
  title: "Random Weighted Bucket Member Draw",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Choose an explicit positive-weight bucket, then a uniform member position within it; not uniform over all flattened members. Zero-weight empty buckets permitted.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
