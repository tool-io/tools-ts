import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

export const calculateFieldOfViewVertical = (
  input: FieldOfViewVerticalInput,
): FieldOfViewVerticalOutput => {
  if (input.horizontalFovDeg <= 0 || input.horizontalFovDeg >= 180)
    simpleError(
      "horizontalFovDeg",
      "The horizontal field of view must be between zero and 180 degrees.",
      "invalid_field_of_view",
    );
  if (input.aspectRatio <= 0)
    simpleError(
      "aspectRatio",
      "The aspect ratio must be greater than zero.",
      "invalid_aspect_ratio",
    );
  const horizontalRad = input.horizontalFovDeg * DEG_TO_RAD;
  return {
    verticalFovDeg:
      2 *
      Math.atan(Math.tan(horizontalRad / 2) / input.aspectRatio) *
      RAD_TO_DEG,
  };
};

export const fieldOfViewVerticalTool = createSimpleTool({
  id: "vr/field-of-view-vertical",
  title: "Vertical Field of View Calculator",
  description:
    "Convert a horizontal field of view and aspect ratio into the vertical field of view of a headset display.",
  inputs: [
    {
      description: "Horizontal field of view in degrees.",
      id: "horizontalFovDeg",
      label: "Horizontal FOV",
      kind: "number",
      maximum: 180,
      minimum: 0,
      unit: "°",
    },
    {
      description: "Display width divided by height.",
      id: "aspectRatio",
      label: "Aspect ratio",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Vertical field of view in degrees.",
      id: "verticalFovDeg",
      label: "Vertical FOV",
      kind: "number",
      unit: "°",
    },
  ],
  calculate: (input) =>
    calculateFieldOfViewVertical(input as FieldOfViewVerticalInput),
});
export const runFieldOfViewVertical = fieldOfViewVerticalTool.execute;
export default fieldOfViewVerticalTool;

export type FieldOfViewVerticalInput = {
  readonly horizontalFovDeg: number;
  readonly aspectRatio: number;
};

export type FieldOfViewVerticalOutput = {
  readonly verticalFovDeg: number;
};

export const fieldOfViewVerticalExample = {
  input: { horizontalFovDeg: 120, aspectRatio: 16 / 9 },
  output: { verticalFovDeg: 88.50715548032275 },
} satisfies ToolExample<FieldOfViewVerticalInput, FieldOfViewVerticalOutput>;
