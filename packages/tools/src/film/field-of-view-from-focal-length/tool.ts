import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FieldOfViewFromFocalLengthInput = Readonly<{
  readonly sensorWidthMillimeters: number;
  readonly focalLengthMillimeters: number;
}>;
export type FieldOfViewFromFocalLengthOutput = Readonly<{
  readonly horizontalAngleDegrees: number;
}>;

export const calculateFieldOfViewFromFocalLength = (
  x: FieldOfViewFromFocalLengthInput,
): FieldOfViewFromFocalLengthOutput => {
  if (
    !Number.isFinite(x.sensorWidthMillimeters) ||
    x.sensorWidthMillimeters < 0
  )
    simpleError(
      "sensorWidthMillimeters",
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
  const horizontalAngleDegrees =
    (2 *
      Math.atan(x.sensorWidthMillimeters / (2 * x.focalLengthMillimeters)) *
      180) /
    Math.PI;
  if (!Number.isFinite(horizontalAngleDegrees))
    simpleError(
      "horizontalAngleDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    horizontalAngleDegrees: Object.is(horizontalAngleDegrees, -0)
      ? 0
      : horizontalAngleDegrees,
  };
};

export const example = {
  input: { sensorWidthMillimeters: 36, focalLengthMillimeters: 50 },
  output: { horizontalAngleDegrees: 39.59775270904986 },
} satisfies ToolExample<
  FieldOfViewFromFocalLengthInput,
  FieldOfViewFromFocalLengthOutput
>;

export const tool = createSimpleTool({
  id: "film/field-of-view-from-focal-length",
  title: "Field Of View From Focal Length",
  description:
    "Horizontal angle of view of a rectilinear lens from sensor width and focal length; excludes distortion.",
  inputs: [
    {
      id: "sensorWidthMillimeters",
      kind: "number",
      label: "Sensor Width Millimeters",
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
      id: "horizontalAngleDegrees",
      kind: "number",
      label: "Horizontal Angle Degrees",
      unit: "°",
    },
  ],
  calculate: (input) =>
    calculateFieldOfViewFromFocalLength({
      sensorWidthMillimeters: input.sensorWidthMillimeters as number,
      focalLengthMillimeters: input.focalLengthMillimeters as number,
    }),
});
export const fieldOfViewFromFocalLengthTool = tool;
export const runFieldOfViewFromFocalLength = tool.execute;
export default tool;
