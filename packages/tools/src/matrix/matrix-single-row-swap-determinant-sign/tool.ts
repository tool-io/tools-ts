import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  firstRow: number;
  secondRow: number;
  rowCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstRow", label: "First row", kind: "integer" },
  { id: "secondRow", label: "Second row", kind: "integer" },
  { id: "rowCount", label: "Row count", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.rowCount, 1, 1000000000);
  H.int(i.firstRow, 0, i.rowCount - 1);
  H.int(i.secondRow, 0, i.rowCount - 1);
  return H.finish({
    determinantMultiplier: i.firstRow === i.secondRow ? 1 : -1,
    changed: i.firstRow !== i.secondRow,
  });
};
export const example = {
  input: { firstRow: 0, secondRow: 1, rowCount: 3 },
  output: { result: { determinantMultiplier: -1, changed: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "matrix/matrix-single-row-swap-determinant-sign",
  title: "Matrix: Matrix Single Row Swap Determinant Sign Tool",
  description:
    "Return the determinant sign multiplier for one explicit row swap, with a row exchanged with itself treated as identity; no determinant computation.",
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
          changed: { type: "boolean" },
          determinantMultiplier: { type: "number" },
        },
        required: ["changed", "determinantMultiplier"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
