import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Rotate90Input = {
  readonly matrix: readonly (readonly number[])[];
  readonly direction?: "clockwise" | "counterclockwise";
};

export type Rotate90Output = {
  readonly rotated: (readonly number[])[];
};

export const calculateRotate90 = (input: Rotate90Input): Rotate90Output => {
  const matrix = input.matrix;
  const direction = input.direction ?? "clockwise";
  if (
    !matrix.length ||
    !matrix[0].length ||
    matrix.some((row) => row.length !== matrix[0].length)
  )
    return simpleError(
      "matrix",
      "Matrix must be non-empty and rectangular.",
      "invalid_matrix",
    );
  const rows = matrix.length;
  const columns = matrix[0].length;
  return {
    rotated:
      direction === "counterclockwise"
        ? Array.from({ length: columns }, (_, c) =>
            matrix.map((row) => row[columns - 1 - c]),
          )
        : Array.from({ length: columns }, (_, c) =>
            matrix.map((row) => row[c]).reverse(),
          ),
  };
};

export const rotate90Example = {
  input: {
    matrix: [
      [1, 2, 3],
      [4, 5, 6],
    ],
  },
  output: {
    rotated: [
      [4, 1],
      [5, 2],
      [6, 3],
    ],
  },
} satisfies ToolExample<Rotate90Input, Rotate90Output>;

export const rotate90Tool = createSimpleTool({
  id: "matrix/rotate-90",
  title: "Matrix Rotation",
  description: "Rotate a matrix by 90 degrees clockwise or counterclockwise.",
  inputs: [
    {
      description: "Non-empty rectangular matrix.",
      id: "matrix",
      kind: "matrix",
      label: "Matrix",
      format: "matrix",
    },
    {
      description: "Rotation direction; clockwise is the default.",
      default: "clockwise",
      id: "direction",
      kind: "string",
      label: "Direction",
      enum: ["clockwise", "counterclockwise"],
    },
  ],
  outputs: [
    {
      description: "Matrix rotated by 90 degrees with transposed dimensions.",
      id: "rotated",
      kind: "matrix",
      label: "Rotated matrix",
      format: "matrix",
    },
  ],
  calculate: (input) =>
    calculateRotate90({
      direction: input.direction as Rotate90Input["direction"],
      matrix: input.matrix as readonly (readonly number[])[],
    }),
});

export const runRotate90 = rotate90Tool.execute;
export default rotate90Tool;
