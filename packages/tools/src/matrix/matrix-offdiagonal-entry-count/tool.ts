import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly rows: number; readonly columns: number };
export type Output = { readonly offDiagonalDecimal: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rows: { type: "integer", minimum: 0 },
    columns: { type: "integer", minimum: 0 },
  },
  required: ["rows", "columns"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offDiagonalDecimal: { type: "string", maxLength: 8192 } },
  required: ["offDiagonalDecimal"],
} as const;
/** Calculate matrix offdiagonal entry count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rows, columns } = request;
  const compute = (): Output => {
    H.integer(rows, 0);
    H.integer(columns, 0);
    return {
      offDiagonalDecimal: (
        BigInt(rows) * BigInt(columns) -
        BigInt(Math.min(rows, columns))
      ).toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rows: 3, columns: 4 },
  output: { offDiagonalDecimal: "9" },
} satisfies ToolExample<Input, Output>;
export const matrixOffdiagonalEntryCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-offdiagonal-entry-count",
    title: "Matrix Offdiagonal Entry Count Tool",
    description:
      "Calculate matrix offdiagonal entry count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rows: { type: "integer", minimum: 0 },
        columns: { type: "integer", minimum: 0 },
      },
      required: ["rows", "columns"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offDiagonalDecimal: { type: "string", maxLength: 8192 } },
      required: ["offDiagonalDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "rows",
          label: "Rows",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "columns",
          label: "Columns",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "offDiagonalDecimal",
          label: "Off Diagonal Decimal",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = matrixOffdiagonalEntryCountTool.execute;
export default matrixOffdiagonalEntryCountTool;
