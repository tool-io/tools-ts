import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly row: number;
  readonly column: number;
  readonly oneBased: boolean;
};
export type Output = {
  readonly diagonalOffset: number;
  readonly rowZeroBased: number;
  readonly columnZeroBased: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer" },
    column: { type: "integer" },
    oneBased: { type: "boolean" },
  },
  required: ["row", "column", "oneBased"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diagonalOffset: { type: "integer" },
    rowZeroBased: { type: "integer" },
    columnZeroBased: { type: "integer" },
  },
  required: ["diagonalOffset", "rowZeroBased", "columnZeroBased"],
} as const;
/** Return the column-minus-row diagonal offset and zero-based coordinates under an explicit matrix index convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { row, column, oneBased } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(row) &&
        row >= (oneBased ? 1 : 0) &&
        row <= Number.MAX_SAFE_INTEGER,
      "row",
    ),
      row);
    (H.domain(
      Number.isSafeInteger(column) &&
        column >= (oneBased ? 1 : 0) &&
        column <= Number.MAX_SAFE_INTEGER,
      "column",
    ),
      column);
    return {
      diagonalOffset: column - row,
      rowZeroBased: row - (oneBased ? 1 : 0),
      columnZeroBased: column - (oneBased ? 1 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { row: 2, column: 4, oneBased: true },
  output: { diagonalOffset: 2, rowZeroBased: 1, columnZeroBased: 3 },
} satisfies ToolExample<Input, Output>;
export const matrixDiagonalUnitOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["matrix", "mathematics"],
      keywords: ["matrix", "mathematics"],
    },
    id: "matrix/matrix-diagonal-unit-offset",
    title: "Matrix Diagonal Unit Offset",
    description:
      "Return the column-minus-row diagonal offset and zero-based coordinates under an explicit matrix index convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        row: { type: "integer" },
        column: { type: "integer" },
        oneBased: { type: "boolean" },
      },
      required: ["row", "column", "oneBased"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diagonalOffset: { type: "integer" },
        rowZeroBased: { type: "integer" },
        columnZeroBased: { type: "integer" },
      },
      required: ["diagonalOffset", "rowZeroBased", "columnZeroBased"],
    },
    ports: {
      inputs: [
        {
          id: "row",
          label: "Row",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "column",
          label: "Column",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "oneBased",
          label: "One Based",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "diagonalOffset",
          label: "Diagonal Offset",
          valueType: { type: "integer" },
        },
        {
          id: "rowZeroBased",
          label: "Row Zero Based",
          valueType: { type: "integer" },
        },
        {
          id: "columnZeroBased",
          label: "Column Zero Based",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = matrixDiagonalUnitOffsetTool.execute;
export default matrixDiagonalUnitOffsetTool;
