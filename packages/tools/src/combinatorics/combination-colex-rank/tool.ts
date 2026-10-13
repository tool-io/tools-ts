import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ indexes: readonly number[]; size: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "indexes", kind: "numberList", label: "indexes" },
  { id: "size", kind: "integer", label: "size" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.combo(i.indexes, i.size);
  return H.finish({
    rank: String(i.indexes.reduce((s, x, j) => s + H.choose(x, j + 1), 0n)),
  });
};
export const example = {
  input: { indexes: [0, 2], size: 4 },
  output: { result: { rank: "1" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/combination-colex-rank",
  title: "Combination Colexicographic Rank",
  description:
    "Exact zero-based colexicographic combination ranking on bounded sorted distinct indexes; results are integer text or explicit index witnesses.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { rank: { type: "string" } },
        required: ["rank"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
