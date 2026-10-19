import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  length: number;
  chunks: number;
  minimum: number;
  maximum: number;
  seed: string;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "length", label: "length", kind: "integer" },
  { id: "chunks", label: "chunks", kind: "integer" },
  { id: "minimum", label: "minimum", kind: "integer" },
  { id: "maximum", label: "maximum", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  const model = H.chunkCounts(i.length, i.chunks, i.minimum, i.maximum);
  H.check(model.total > 0n);
  let rank = H.randomBig(model.total, random),
    remaining = i.length;
  const lengths: number[] = [];
  for (let k = i.chunks; k > 0; k--) {
    let chosen = 0;
    for (let n = i.minimum; n <= i.maximum; n++) {
      const count = model.ways(remaining - n, k - 1);
      if (rank < count) {
        chosen = n;
        break;
      }
      rank -= count;
    }
    H.check(chosen > 0);
    lengths.push(chosen);
    remaining -= chosen;
  }
  let p = 0;
  return H.finish({
    seed: i.seed,
    lengths,
    cuts: lengths.slice(0, -1).map((x) => {
      p += x;
      return p;
    }),
    support: String(model.total),
  });
};
export const example = {
  input: { length: 6, chunks: 3, minimum: 1, maximum: 3, seed: "batch56" },
  output: {
    result: { seed: "batch56", lengths: [2, 3, 1], cuts: [2, 5], support: "7" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Random Bounded Chunk Cut Positions", "random generation"],
    collections: ["data", "learn"],
    fields: ["random", "random generation"],
    keywords: ["random generation"],
  },
  id: "random/bounded-chunk-cut-positions",
  title: "Random Bounded Chunk Cut Positions",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Uniformly sample bounded positive chunk-length compositions of an explicit total with fixed chunk count using exact completion-count unranking; infeasible support rejects.",
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
          lengths: { type: "array", items: { type: "number" } },
          cuts: { type: "array", items: { type: "number" } },
          support: { type: "string" },
        },
        required: ["seed", "lengths", "cuts", "support"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
