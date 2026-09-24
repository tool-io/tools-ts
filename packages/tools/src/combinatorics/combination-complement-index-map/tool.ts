import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  universeSize: number;
  indices: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "universeSize", label: "Universe size", kind: "integer" },
  { id: "indices", label: "Indices", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.universeSize, 0, 128);
  H.check(
    i.indices.every(
      (x, j) =>
        Number.isSafeInteger(x) &&
        x >= 0 &&
        x < i.universeSize &&
        (!j || x > i.indices[j - 1]),
    ),
  );
  return H.finish({
    complementIndices: Array.from(
      { length: i.universeSize },
      (_, j) => j,
    ).filter((j) => !i.indices.includes(j)),
  });
};
export const example = {
  input: { universeSize: 5, indices: [0, 3] },
  output: { result: { complementIndices: [1, 2, 4] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/combination-complement-index-map",
  title: "Combinatorics: Combination Complement Index Map Tool",
  description:
    "Map a sorted unique combination of zero-based indices to its ordered universe complement, not a generic value-set lookup.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          complementIndices: { type: "array", items: { type: "number" } },
        },
        required: ["complementIndices"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
