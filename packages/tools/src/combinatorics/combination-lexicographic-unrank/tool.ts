import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ size: number; count: number; rank: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "size", kind: "integer", label: "size" },
  { id: "count", kind: "integer", label: "count" },
  { id: "rank", kind: "string", label: "rank" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.size, 0, 128);
  H.int(i.count, 0, i.size);
  let rank = H.bigint(i.rank);
  H.check(rank >= 0n && rank < H.choose(i.size, i.count));
  return H.finish({ indexes: H.comboUnrank(i.size, i.count, rank) });
};
export const example = {
  input: { size: 4, count: 2, rank: "1" },
  output: { result: { indexes: [0, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/combination-lexicographic-unrank",
  title: "Combination Lexicographic Unrank",
  description:
    "Exact zero-based lexicographic combination unranking on bounded sorted distinct indexes; results are integer text or explicit index witnesses.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { indexes: { type: "array", items: { type: "number" } } },
        required: ["indexes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
