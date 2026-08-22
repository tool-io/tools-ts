import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const circleArcLengthExample = {
  input: { angleDeg: 90, radius: 2 },
  output: { arcLength: Math.PI },
} satisfies ToolExample<CircleArcLengthInput, CircleArcLengthOutput>;

export type CircleArcLengthInput = {
  readonly angleDeg: number;
  readonly radius: number;
};
export type CircleArcLengthOutput = { readonly arcLength: number };

export const calculateCircleArcLength = (
  input: CircleArcLengthInput,
): CircleArcLengthOutput => {
  if (input.angleDeg < 0 || input.angleDeg > 360 || input.radius < 0)
    simpleError(
      "angleDeg",
      "Angle must be between zero and three-sixty.",
      "invalid_angle",
    );
  return {
    arcLength: (input.angleDeg / 360) * 2 * Math.PI * input.radius,
  };
};

export const circleArcLengthTool = createSimpleTool({
  calculate: (input) =>
    calculateCircleArcLength(input as unknown as CircleArcLengthInput),
  description:
    "Compute the arc length of a circular segment from its central angle and radius.",
  id: "geometry/circle-arc-length",
  inputs: [
    {
      description: "Central angle subtending the arc.",
      id: "angleDeg",
      kind: "number",
      label: "Angle",
      unit: "°",
      maximum: 360,
      minimum: 0,
    },
    {
      description: "Radius of the circle.",
      id: "radius",
      kind: "number",
      label: "Radius",
      minimum: 0,
    },
  ],
  outputs: [{ id: "arcLength", kind: "number", label: "Arc length" }],
  title: "Circle Arc Length Calculator",
});
export const runCircleArcLength = circleArcLengthTool.execute;
export default circleArcLengthTool;
