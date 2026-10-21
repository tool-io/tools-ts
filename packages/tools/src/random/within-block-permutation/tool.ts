import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ blocksJson: string; seed: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "blocksJson", label: "blocksJson", kind: "string" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  const blocks = H.buckets(i.blocksJson);
  H.check(blocks.some((v) => v.length > 1));
  return H.finish({
    seed: i.seed,
    blocks: blocks.map((v) =>
      H.shuffle(
        v.map((value, index) => ({ value, index })),
        random,
      ),
    ),
  });
};
export const example = {
  input: { blocksJson: '[["a","b"],["c","d"]]', seed: "batch56" },
  output: {
    result: {
      seed: "batch56",
      blocks: [
        [
          { value: "a", index: 0 },
          { value: "b", index: 1 },
        ],
        [
          { value: "c", index: 0 },
          { value: "d", index: 1 },
        ],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Random Within-Block Permutation", "random generation"],
    collections: ["data", "learn"],
    fields: ["random", "random generation"],
    keywords: ["random generation"],
  },
  id: "random/within-block-permutation",
  title: "Random Within-Block Permutation",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Independently uniformly permute positions within each fixed block, preserving block order and source indexes.",
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
          blocks: {
            type: "array",
            items: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  value: { type: "string" },
                  index: { type: "number" },
                },
                required: ["value", "index"],
              },
            },
          },
        },
        required: ["seed", "blocks"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
