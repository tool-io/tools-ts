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
  H.combo(
    [...i.indexes].sort((a, b) => a - b),
    i.size,
  );
  return H.finish({
    indexes: Array.from({ length: i.size }, (_, j) => j).filter(
      (j) => !i.indexes.includes(j),
    ),
  });
};
export const example = {
  input: { indexes: [0, 3], size: 4 },
  output: { result: { indexes: [1, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/subset-complement-indexes",
  title: "Subset Complement Indexes",
  description:
    "Complement a unique explicit index subset against a bounded 0..size-1 universe, returning ascending omitted indexes.",
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
