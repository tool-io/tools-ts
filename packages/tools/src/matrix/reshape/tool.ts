import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReshapeInput = {
  readonly matrix: readonly (readonly number[])[];
  readonly rows: number;
  readonly columns: number;
};

export type ReshapeOutput = {
  readonly reshaped: readonly (readonly number[])[];
};

export const calculateReshape = (input: ReshapeInput): ReshapeOutput => {
  const flat = input.matrix.flat();
  if (!flat.length)
    return simpleError("matrix", "Matrix must be non-empty.", "invalid_matrix");
  if (
    !Number.isSafeInteger(input.rows) ||
    !Number.isSafeInteger(input.columns) ||
    input.rows < 1 ||
    input.columns < 1
  )
    return simpleError(
      "rows",
      "Rows and columns must be positive integers.",
      "invalid_shape",
    );
  if (input.rows * input.columns !== flat.length)
    return simpleError(
      "rows",
      `Cannot reshape ${flat.length} values into a ${input.rows}x${input.columns} matrix.`,
      "shape_mismatch",
    );
  const reshaped: number[][] = [];
  for (let row = 0; row < input.rows; row += 1)
    reshaped.push(flat.slice(row * input.columns, (row + 1) * input.columns));
  return { reshaped };
};

export const reshapeExample = {
  input: {
    matrix: [
      [1, 2],
      [3, 4],
      [5, 6],
    ],
    rows: 2,
    columns: 3,
  },
  output: {
    reshaped: [
      [1, 2, 3],
      [4, 5, 6],
    ],
  },
} satisfies ToolExample<ReshapeInput, ReshapeOutput>;

export const reshapeTool = createSimpleTool({
  id: "matrix/reshape",
  title: "Matrix Reshape",
  description:
    "Rearrange a matrix's values into a new shape reading them in row-major order.",
  inputs: [
    {
      description: "Non-empty source matrix.",
      id: "matrix",
      kind: "matrix",
      label: "Matrix",
      format: "matrix",
    },
    {
      description: "Row count of the reshaped matrix.",
      id: "rows",
      kind: "integer",
      label: "Rows",
      minimum: 1,
    },
    {
      description: "Column count of the reshaped matrix.",
      id: "columns",
      kind: "integer",
      label: "Columns",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description:
        "Matrix with the requested shape holding the same values in row-major order.",
      id: "reshaped",
      kind: "matrix",
      label: "Reshaped matrix",
      format: "matrix",
    },
  ],
  calculate: (input) =>
    calculateReshape({
      columns: input.columns as number,
      matrix: input.matrix as readonly (readonly number[])[],
      rows: input.rows as number,
    }),
});

export const runReshape = reshapeTool.execute;
export default reshapeTool;
