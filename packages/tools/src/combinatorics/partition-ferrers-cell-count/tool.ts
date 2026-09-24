import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ parts: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "parts", label: "Parts", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.parts.every(
      (x, j) =>
        Number.isSafeInteger(x) &&
        x > 0 &&
        x <= 1000000 &&
        (!j || x <= i.parts[j - 1]),
    ),
  );
  return H.finish({
    cellCount: i.parts.reduce((s, x) => s + x, 0),
    rowCount: i.parts.length,
    columnCount: i.parts[0] ?? 0,
  });
};
export const example = {
  input: { parts: [4, 3, 1] },
  output: { result: { cellCount: 8, rowCount: 3, columnCount: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/partition-ferrers-cell-count",
  title: "Combinatorics: Partition Ferrers Cell Count Tool",
  description:
    "Count cells and extents of a supplied descending Ferrers partition diagram, preserving the empty diagram.",
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
          cellCount: { type: "number" },
          columnCount: { type: "number" },
          rowCount: { type: "number" },
        },
        required: ["cellCount", "columnCount", "rowCount"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
