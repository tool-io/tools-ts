import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  length: number;
  deletions: number;
  seed: string;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "length", label: "length", kind: "integer" },
  { id: "deletions", label: "deletions", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.int(i.length, 1, 128);
  H.int(i.deletions, 1, i.length);
  const deleted = H.choosePositions(i.length, i.deletions, random).sort(
    (a, b) => a - b,
  );
  return H.finish({
    seed: i.seed,
    deleted,
    mask: Array.from({ length: i.length }, (_, j) =>
      Number(deleted.includes(j)),
    ),
  });
};
export const example = {
  input: { length: 5, deletions: 2, seed: "batch56" },
  output: {
    result: { seed: "batch56", deleted: [3, 4], mask: [0, 0, 0, 1, 1] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Random Exact Deletion Index Mask", "random generation"],
    collections: ["data", "learn"],
    fields: ["random", "random generation"],
    keywords: ["random generation"],
  },
  id: "random/exact-deletion-index-mask",
  title: "Random Exact Deletion Index Mask",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Choose a uniform exact-size deletion index subset, retaining source positions and one-is-deleted mask; does not edit payload data.",
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
          deleted: { type: "array", items: { type: "number" } },
          mask: { type: "array", items: { type: "number" } },
        },
        required: ["seed", "deleted", "mask"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
