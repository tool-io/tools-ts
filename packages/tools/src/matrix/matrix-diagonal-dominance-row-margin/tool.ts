import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ row: readonly number[]; diagonalIndex: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "row", label: "Row", kind: "numberList" },
  { id: "diagonalIndex", label: "Diagonal index", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.diagonalIndex, 0, i.row.length - 1);
  const margin =
    Math.abs(i.row[i.diagonalIndex]) -
    i.row.reduce((s, x, j) => s + (j === i.diagonalIndex ? 0 : Math.abs(x)), 0);
  return H.finish({
    margin,
    weaklyDominant: margin >= 0,
    strictlyDominant: margin > 0,
  });
};
export const example = {
  input: { row: [1, 4, -2], diagonalIndex: 1 },
  output: {
    result: { margin: 1, weaklyDominant: true, strictlyDominant: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "matrix/matrix-diagonal-dominance-row-margin",
  title: "Matrix: Matrix Diagonal Dominance Row Margin Tool",
  description:
    "Check one row absolute diagonal-dominance margin against its explicit diagonal coordinate; not a whole-matrix invertibility or convergence guarantee.",
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
          margin: { type: "number" },
          strictlyDominant: { type: "boolean" },
          weaklyDominant: { type: "boolean" },
        },
        required: ["margin", "strictlyDominant", "weaklyDominant"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
