import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FocalLengthFromFieldOfViewInput = Readonly<{
  readonly sensorWidthMillimeters: number;
  readonly horizontalAngleDegrees: number;
}>;
export type FocalLengthFromFieldOfViewOutput = Readonly<{
  readonly focalLengthMillimeters: number;
}>;

export const calculateFocalLengthFromFieldOfView = (
  x: FocalLengthFromFieldOfViewInput,
): FocalLengthFromFieldOfViewOutput => {
  if (
    !Number.isFinite(x.sensorWidthMillimeters) ||
    x.sensorWidthMillimeters < 0
  )
    simpleError(
      "sensorWidthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.horizontalAngleDegrees) ||
    x.horizontalAngleDegrees < 0
  )
    simpleError(
      "horizontalAngleDegrees",
      "Provide a finite number at least 0.",
    );
  if (x.horizontalAngleDegrees <= 0 || x.horizontalAngleDegrees >= 180)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const focalLengthMillimeters =
    x.sensorWidthMillimeters /
    (2 * Math.tan((x.horizontalAngleDegrees * Math.PI) / 360));
  if (!Number.isFinite(focalLengthMillimeters))
    simpleError(
      "focalLengthMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    focalLengthMillimeters: Object.is(focalLengthMillimeters, -0)
      ? 0
      : focalLengthMillimeters,
  };
};

export const example = {
  input: { sensorWidthMillimeters: 36, horizontalAngleDegrees: 39.6 },
  output: { focalLengthMillimeters: 49.996923370469545 },
} satisfies ToolExample<
  FocalLengthFromFieldOfViewInput,
  FocalLengthFromFieldOfViewOutput
>;

export const tool = createSimpleTool({
  id: "film/focal-length-from-field-of-view",
  title: "Focal Length From Field Of View",
  description:
    "Focal length from sensor width and horizontal angle of view under a rectilinear thin-lens model.",
  inputs: [
    {
      id: "sensorWidthMillimeters",
      kind: "number",
      label: "Sensor Width Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "horizontalAngleDegrees",
      kind: "number",
      label: "Horizontal Angle Degrees",
      unit: "°",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "focalLengthMillimeters",
      kind: "number",
      label: "Focal Length Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateFocalLengthFromFieldOfView({
      sensorWidthMillimeters: input.sensorWidthMillimeters as number,
      horizontalAngleDegrees: input.horizontalAngleDegrees as number,
    }),
});
export const focalLengthFromFieldOfViewTool = tool;
export const runFocalLengthFromFieldOfView = tool.execute;
export default tool;
