import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ pairsJson: string; seed: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "pairsJson", label: "pairsJson", kind: "string" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  const pairs = H.buckets(i.pairsJson);
  H.check(pairs.length > 0 && pairs.every((v) => v.length === 2));
  return H.finish({
    seed: i.seed,
    pairs: pairs.map((pair, index) => {
      const reversed = H.randint(0, 1, random) === 1;
      return { index, reversed, values: reversed ? [...pair].reverse() : pair };
    }),
  });
};
export const example = {
  input: { pairsJson: '[["a","b"],["c","d"]]', seed: "batch56" },
  output: {
    result: {
      seed: "batch56",
      pairs: [
        { index: 0, reversed: true, values: ["b", "a"] },
        { index: 1, reversed: true, values: ["d", "c"] },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Random Supplied Pair Orientations", "random generation"],
    collections: ["data", "learn"],
    fields: ["random", "random generation"],
    keywords: ["random generation"],
  },
  id: "random/supplied-pair-orientations",
  title: "Random Supplied Pair Orientations",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Independently choose either orientation for each supplied two-position pair without changing pair membership; equal labels may render identically.",
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
          pairs: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                reversed: { type: "boolean" },
                values: { type: "array", items: { type: "string" } },
              },
              required: ["index", "reversed", "values"],
            },
          },
        },
        required: ["seed", "pairs"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
