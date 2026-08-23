import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const RAD_TO_DEG = 180 / Math.PI;

export const calculateFovFromFocalLengthVr = (
  input: FovFromFocalLengthVrInput,
): FovFromFocalLengthVrOutput => {
  if (input.focalLengthMm <= 0)
    simpleError(
      "focalLengthMm",
      "The focal length must be greater than zero.",
      "invalid_focal_length",
    );
  if (input.sensorWidthMm <= 0)
    simpleError(
      "sensorWidthMm",
      "The sensor width must be greater than zero.",
      "invalid_sensor_width",
    );
  return {
    fovDeg:
      2 *
      Math.atan(input.sensorWidthMm / (2 * input.focalLengthMm)) *
      RAD_TO_DEG,
  };
};

export const fovFromFocalLengthVrTool = createSimpleTool({
  id: "vr/fov-from-focal-length-vr",
  title: "FOV From Focal Length VR Calculator",
  description:
    "Compute the field of view covered by a lens as 2·atan(sensor width / (2·focal length)).",
  inputs: [
    {
      description: "Effective focal length of the lens.",
      id: "focalLengthMm",
      label: "Focal length",
      kind: "number",
      minimum: 0,
      unit: "mm",
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
      description: "Field of view across the sensor width.",
      id: "fovDeg",
      label: "Field of view",
      kind: "number",
      unit: "°",
    },
  ],
  calculate: (input) =>
    calculateFovFromFocalLengthVr(input as FovFromFocalLengthVrInput),
});
export const runFovFromFocalLengthVr = fovFromFocalLengthVrTool.execute;
export default fovFromFocalLengthVrTool;

export type FovFromFocalLengthVrInput = {
  readonly focalLengthMm: number;
  readonly sensorWidthMm: number;
};

export type FovFromFocalLengthVrOutput = {
  readonly fovDeg: number;
};

export const fovFromFocalLengthVrExample = {
  input: { focalLengthMm: 20, sensorWidthMm: 40 },
  output: { fovDeg: 90 },
} satisfies ToolExample<FovFromFocalLengthVrInput, FovFromFocalLengthVrOutput>;
