import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

export const calculateFieldOfViewHorizontal = (
  input: FieldOfViewHorizontalInput,
): FieldOfViewHorizontalOutput => {
  if (input.verticalFovDeg <= 0 || input.verticalFovDeg >= 180)
    simpleError(
      "verticalFovDeg",
      "The vertical field of view must be between zero and 180 degrees.",
      "invalid_field_of_view",
    );
  if (input.aspectRatio <= 0)
    simpleError(
      "aspectRatio",
      "The aspect ratio must be greater than zero.",
      "invalid_aspect_ratio",
    );
  const verticalRad = input.verticalFovDeg * DEG_TO_RAD;
  return {
    horizontalFovDeg:
      2 * Math.atan(Math.tan(verticalRad / 2) * input.aspectRatio) * RAD_TO_DEG,
  };
};

export const fieldOfViewHorizontalTool = createSimpleTool({
  id: "vr/field-of-view-horizontal",
  title: "Horizontal Field of View Calculator",
  description:
    "Convert a vertical field of view and aspect ratio into the horizontal field of view of a headset display.",
  inputs: [
    {
      description: "Vertical field of view in degrees.",
      id: "verticalFovDeg",
      label: "Vertical FOV",
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
      description: "Horizontal field of view in degrees.",
      id: "horizontalFovDeg",
      label: "Horizontal FOV",
      kind: "number",
      unit: "°",
    },
  ],
  calculate: (input) =>
    calculateFieldOfViewHorizontal(input as FieldOfViewHorizontalInput),
});
export const runFieldOfViewHorizontal = fieldOfViewHorizontalTool.execute;
export default fieldOfViewHorizontalTool;

export type FieldOfViewHorizontalInput = {
  readonly verticalFovDeg: number;
  readonly aspectRatio: number;
};

export type FieldOfViewHorizontalOutput = {
  readonly horizontalFovDeg: number;
};

export const fieldOfViewHorizontalExample = {
  input: { verticalFovDeg: 90, aspectRatio: 16 / 9 },
  output: { horizontalFovDeg: 121.28449291441746 },
} satisfies ToolExample<
  FieldOfViewHorizontalInput,
  FieldOfViewHorizontalOutput
>;
