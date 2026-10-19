import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ bucketsJson: string; seed: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bucketsJson", label: "bucketsJson", kind: "string" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext) => {
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
        { bucket: 0, position: 1, value: "b" },
        { bucket: 1, position: 0, value: "c" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Random Bucket Representative Order", "random generation"],
    collections: ["data", "learn"],
    fields: ["random", "random generation"],
    keywords: ["random generation"],
  },
  id: "random/bucket-representative-order",
  title: "Random Bucket Representative Order",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Choose uniformly within each nonempty bucket then independently permute representative positions; repeated rendered values remain separate source positions.",
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
          representatives: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                bucket: { type: "number" },
                position: { type: "number" },
                value: { type: "string" },
              },
              required: ["bucket", "position", "value"],
            },
          },
        },
        required: ["seed", "representatives"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
