import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const DEG_TO_RAD = Math.PI / 180;

export const calculateFocalLengthFromFovVr = (
  input: FocalLengthFromFovVrInput,
): FocalLengthFromFovVrOutput => {
  if (input.fovDeg <= 0 || input.fovDeg >= 180)
    simpleError(
      "fovDeg",
      "The field of view must be strictly between zero and 180 degrees.",
      "invalid_fov",
    );
  if (input.sensorWidthMm <= 0)
    simpleError(
      "sensorWidthMm",
      "The sensor width must be greater than zero.",
      "invalid_sensor_width",
    );
  return {
    focalLengthMm:
      input.sensorWidthMm / (2 * Math.tan((input.fovDeg * DEG_TO_RAD) / 2)),
  };
};

export const focalLengthFromFovVrTool = createSimpleTool({
  id: "vr/focal-length-from-fov-vr",
  title: "Focal Length From FOV VR Calculator",
  description:
    "Compute the lens focal length needed for a field of view as sensor width / (2·tan(FOV/2)).",
  inputs: [
    {
      description: "Desired field of view in degrees between zero and 180.",
      id: "fovDeg",
      label: "Field of view",
      kind: "number",
      maximum: 180,
      minimum: 0,
      unit: "°",
    },
    {
      description: "Width of the sensor or display area covered.",
      id: "sensorWidthMm",
      label: "Sensor width",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Required focal length.",
      id: "focalLengthMm",
      label: "Focal length",
      kind: "number",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateFocalLengthFromFovVr(input as FocalLengthFromFovVrInput),
});
export const runFocalLengthFromFovVr = focalLengthFromFovVrTool.execute;
export default focalLengthFromFovVrTool;

export type FocalLengthFromFovVrInput = {
  readonly fovDeg: number;
  readonly sensorWidthMm: number;
};

export type FocalLengthFromFovVrOutput = {
  readonly focalLengthMm: number;
};

export const focalLengthFromFovVrExample = {
  input: { fovDeg: 100, sensorWidthMm: 40 },
  output: { focalLengthMm: 16.781992623545598 },
} satisfies ToolExample<FocalLengthFromFovVrInput, FocalLengthFromFovVrOutput>;
