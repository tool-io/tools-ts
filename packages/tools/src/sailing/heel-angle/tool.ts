import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeelAngleInput = {
  readonly displacementPounds: number;
  readonly heelingMomentFtLb: number;
  readonly metacentricHeightFeet: number;
};

export type HeelAngleOutput = {
  readonly heelAngleDegrees: number;
};

export const heelAngleExample = {
  input: {
    displacementPounds: 1000,
    heelingMomentFtLb: 500,
    metacentricHeightFeet: 1,
  },
  output: { heelAngleDegrees: 30.000000000000004 },
} satisfies ToolExample<HeelAngleInput, HeelAngleOutput>;

export const calculateHeelAngle = (input: HeelAngleInput): HeelAngleOutput => {
  if (input.heelingMomentFtLb < 0)
    simpleError(
      "heelingMomentFtLb",
      "The heeling moment cannot be negative.",
      "invalid_input",
    );
  if (input.displacementPounds <= 0)
    simpleError(
      "displacementPounds",
      "The displacement must be positive.",
      "invalid_input",
    );
  if (input.metacentricHeightFeet <= 0)
    simpleError(
      "metacentricHeightFeet",
      "The metacentric height must be positive.",
      "invalid_input",
    );
  const ratio =
    input.heelingMomentFtLb /
    (input.displacementPounds * input.metacentricHeightFeet);
  if (ratio > 1)
    simpleError(
      "heelingMomentFtLb",
      "The heeling moment exceeds the righting capacity; capsize risk.",
      "capsize_risk",
    );
  return { heelAngleDegrees: Math.asin(Math.min(1, ratio)) * (180 / Math.PI) };
};

export const heelAngleTool = createSimpleTool({
  calculate: (input) => calculateHeelAngle(input as unknown as HeelAngleInput),
  description:
    "Estimate the steady heel angle from heelDeg = degrees(asin(min(1, heelingMomentFtLb / (displacementPounds * metacentricHeightFeet)))).",
  id: "sailing/heel-angle",
  inputs: [
    {
      description: "Heeling moment applied to the boat.",
      id: "heelingMomentFtLb",
      kind: "number",
      label: "Heeling moment",
      minimum: 0,
      unit: "ft\u00B7lb",
    },
    {
      description: "Boat displacement.",
      id: "displacementPounds",
      kind: "number",
      label: "Displacement",
      minimum: 0,
      unit: "lb",
    },
    {
      description: "Metacentric height GM.",
      id: "metacentricHeightFeet",
      kind: "number",
      label: "Metacentric height",
      minimum: 0,
      unit: "ft",
    },
  ],
  outputs: [
    {
      description: "Steady heel angle in degrees.",
      format: "angle-deg",
      id: "heelAngleDegrees",
      kind: "number",
      label: "Heel angle",
      unit: "deg",
    },
  ],
  title: "Heel Angle Calculator",
});
export const runHeelAngle = heelAngleTool.execute;
export default heelAngleTool;
