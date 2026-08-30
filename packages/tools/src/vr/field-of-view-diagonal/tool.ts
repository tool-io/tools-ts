import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FieldOfViewDiagonalInput = Readonly<{
  readonly horizontalDegrees: number;
  readonly verticalDegrees: number;
}>;
export type FieldOfViewDiagonalOutput = Readonly<{
  readonly diagonalDegrees: number;
}>;

export const calculateFieldOfViewDiagonal = (
  x: FieldOfViewDiagonalInput,
): FieldOfViewDiagonalOutput => {
  if (!Number.isFinite(x.horizontalDegrees) || x.horizontalDegrees <= 0)
    simpleError("horizontalDegrees", "Provide a finite positive number.");
  if (!Number.isFinite(x.verticalDegrees) || x.verticalDegrees <= 0)
    simpleError("verticalDegrees", "Provide a finite positive number.");
  if (!(x.horizontalDegrees < 180 && x.verticalDegrees < 180))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const diagonalDegrees =
    (2 *
      Math.atan(
        Math.hypot(
          Math.tan((x.horizontalDegrees * Math.PI) / 360),
          Math.tan((x.verticalDegrees * Math.PI) / 360),
        ),
      ) *
      180) /
    Math.PI;
  if (!Number.isFinite(diagonalDegrees))
    simpleError(
      "diagonalDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    diagonalDegrees: Object.is(diagonalDegrees, -0) ? 0 : diagonalDegrees,
  };
};

export const example = {
  input: {
    horizontalDegrees: 90,
    verticalDegrees: 90,
  },
  output: { diagonalDegrees: 109.47122063449069 },
} satisfies ToolExample<FieldOfViewDiagonalInput, FieldOfViewDiagonalOutput>;

export const tool = createSimpleTool({
  id: "vr/field-of-view-diagonal",
  title: "Field Of View Diagonal",
  description:
    "Diagonal field-of-view angle for a rectangular symmetric frustum from horizontal and vertical full angles.",
  inputs: [
    {
      id: "horizontalDegrees",
      kind: "number",
      label: "Horizontal Degrees",
      unit: "deg",
      minimum: 0,
    },
    {
      id: "verticalDegrees",
      kind: "number",
      label: "Vertical Degrees",
      unit: "deg",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "diagonalDegrees",
      kind: "number",
      label: "Diagonal Degrees",
      unit: "deg",
    },
  ],
  calculate: (input) =>
    calculateFieldOfViewDiagonal({
      horizontalDegrees: input.horizontalDegrees as number,
      verticalDegrees: input.verticalDegrees as number,
    }),
});
export const fieldOfViewDiagonalTool = tool;
export const runFieldOfViewDiagonal = tool.execute;
export default tool;
