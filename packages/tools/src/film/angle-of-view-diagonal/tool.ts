import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AngleOfViewDiagonalInput = Readonly<{
  readonly sensorDiagonalMillimeters: number;
  readonly focalLengthMillimeters: number;
}>;
export type AngleOfViewDiagonalOutput = Readonly<{
  readonly diagonalAngleDegrees: number;
}>;

export const calculateAngleOfViewDiagonal = (
  x: AngleOfViewDiagonalInput,
): AngleOfViewDiagonalOutput => {
  if (
    !Number.isFinite(x.sensorDiagonalMillimeters) ||
    x.sensorDiagonalMillimeters < 0
  )
    simpleError(
      "sensorDiagonalMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.focalLengthMillimeters) ||
    x.focalLengthMillimeters < 0
  )
    simpleError(
      "focalLengthMillimeters",
      "Provide a finite number at least 0.",
    );
  const diagonalAngleDegrees =
    (2 *
      Math.atan(x.sensorDiagonalMillimeters / (2 * x.focalLengthMillimeters)) *
      180) /
    Math.PI;
  if (!Number.isFinite(diagonalAngleDegrees))
    simpleError(
      "diagonalAngleDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    diagonalAngleDegrees: Object.is(diagonalAngleDegrees, -0)
      ? 0
      : diagonalAngleDegrees,
  };
};

export const example = {
  input: { sensorDiagonalMillimeters: 43.27, focalLengthMillimeters: 50 },
  output: { diagonalAngleDegrees: 46.79627029668992 },
} satisfies ToolExample<AngleOfViewDiagonalInput, AngleOfViewDiagonalOutput>;

export const tool = createSimpleTool({
  id: "film/angle-of-view-diagonal",
  title: "Angle Of View Diagonal",
  description:
    "Diagonal angle of view for a rectilinear lens from sensor diagonal and focal length.",
  inputs: [
    {
      id: "sensorDiagonalMillimeters",
      kind: "number",
      label: "Sensor Diagonal Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "focalLengthMillimeters",
      kind: "number",
      label: "Focal Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "diagonalAngleDegrees",
      kind: "number",
      label: "Diagonal Angle Degrees",
      unit: "°",
    },
  ],
  calculate: (input) =>
    calculateAngleOfViewDiagonal({
      sensorDiagonalMillimeters: input.sensorDiagonalMillimeters as number,
      focalLengthMillimeters: input.focalLengthMillimeters as number,
    }),
});
export const angleOfViewDiagonalTool = tool;
export const runAngleOfViewDiagonal = tool.execute;
export default tool;
