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
  const r = H.comboRank(i.indexes, i.size) - 1n;
  return H.finish({
    indexes:
      r >= 0n && r < H.choose(i.size, i.indexes.length)
        ? H.comboUnrank(i.size, i.indexes.length, r)
        : null,
  });
};
export const example = {
  input: { indexes: [0, 2], size: 4 },
  output: { result: { indexes: [0, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/combination-previous-indexes",
  title: "Previous Combination Indexes",
  description:
    "Return the previous lexicographic fixed-size index combination without wrapping; null marks the order boundary.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          indexes: {
            anyOf: [
              { type: "array", items: { type: "number" } },
              { type: "null" },
            ],
          },
        },
        required: ["indexes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
