import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ width: number; seed: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "width", label: "width", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.int(i.width, 1, 64);
  const ways = [1n, 1n];
  for (let j = 2; j <= i.width; j++) ways[j] = ways[j - 1] + ways[j - 2];
  let rank = H.randomBig(ways[i.width], random),
    remaining = i.width,
    column = 0;
  const tiles: { kind: string; column: number }[] = [];
  while (remaining) {
    const vertical = ways[remaining - 1];
    if (rank < vertical) {
      tiles.push({ kind: "vertical", column });
      column++;
      remaining--;
    } else {
      rank -= vertical;
      tiles.push({ kind: "horizontal-pair", column });
      column += 2;
      remaining -= 2;
    }
  }
  return H.finish({ seed: i.seed, tiles, support: String(ways[i.width]) });
};
export const example = {
  input: { width: 3, seed: "batch56" },
  output: {
    result: {
      seed: "batch56",
      tiles: [
        { kind: "vertical", column: 0 },
        { kind: "horizontal-pair", column: 1 },
      ],
      support: "3",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Random Two-Row Domino Tiling", "random generation"],
    collections: ["data", "learn"],
    fields: ["random", "random generation"],
    keywords: ["random generation"],
  },
  id: "random/two-row-domino-tiling",
  title: "Random Two-Row Domino Tiling",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Uniformly sample complete domino tilings of a 2xN board via exact Fibonacci completion counts and rank unranking, reporting vertical singles or paired horizontal domino placements.",
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
          tiles: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                kind: { type: "string" },
                column: { type: "number" },
              },
              required: ["kind", "column"],
            },
          },
          support: { type: "string" },
        },
        required: ["seed", "tiles", "support"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
