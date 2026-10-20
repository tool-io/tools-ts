import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ rows: number; columns: number; seed: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "rows", label: "rows", kind: "integer" },
  { id: "columns", label: "columns", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.int(i.rows, 1, 11);
  H.int(i.columns, 1, 11);
  const first = Array.from({ length: i.rows }, () =>
    Array.from({ length: i.columns }, () => H.randint(0, 1, random)),
  );
  return H.finish({
    seed: i.seed,
    first,
    complement: first.map((row) => row.map((x) => 1 - x)),
  });
};
export const example = {
  input: { rows: 2, columns: 2, seed: "batch56" },
  output: {
    result: {
      seed: "batch56",
      first: [
        [1, 1],
        [1, 1],
      ],
      complement: [
        [0, 0],
        [0, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Random Complementary Bitmap Pair", "random generation"],
    collections: ["data", "learn"],
    fields: ["random", "random generation"],
    keywords: ["random generation"],
  },
  id: "random/complementary-bitmap-pair",
  title: "Random Complementary Bitmap Pair",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Sample one fair independent-cell binary bitmap and return its exact bitwise complement; pair assignments uniform over first masks, not independent paired images.",
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
          first: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
          complement: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["seed", "first", "complement"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
