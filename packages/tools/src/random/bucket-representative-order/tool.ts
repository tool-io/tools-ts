import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ bucketsJson: string; seed: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bucketsJson", label: "bucketsJson", kind: "string" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  const buckets = H.buckets(i.bucketsJson);
  H.check(buckets.length > 0 && buckets.every((v) => v.length > 0));
  const representatives = buckets.map((v, bucket) => {
    const position = H.randint(0, v.length - 1, random);
    return { bucket, position, value: v[position] };
  });
  return H.finish({
    seed: i.seed,
    representatives: H.shuffle(representatives, random),
  });
};
export const example = {
  input: { bucketsJson: '[["a","b"],["c"]]', seed: "batch56" },
  output: {
    result: {
      seed: "batch56",
      representatives: [
        { bucket: 1, position: 0, value: "c" },
        { bucket: 0, position: 0, value: "a" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/bucket-representative-order",
  title: "Random Bucket Representative Order",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Choose uniformly within each nonempty bucket then independently permute representative positions; repeated rendered values remain separate source positions.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
