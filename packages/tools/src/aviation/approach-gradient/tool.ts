import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ApproachGradientInput = {
  readonly altitudeFt: number;
  readonly distanceNm: number;
};

export type ApproachGradientOutput = {
  readonly gradientPercent: number;
};

const FT_PER_NM = 6076.115485564;

export const approachGradientExample = {
  input: { altitudeFt: 318, distanceNm: 1 },
  output: { gradientPercent: 5.233606911447346 },
} satisfies ToolExample<ApproachGradientInput, ApproachGradientOutput>;

export const calculateApproachGradient = (
  input: ApproachGradientInput,
): ApproachGradientOutput => {
  if (input.distanceNm <= 0)
    simpleError(
      "distanceNm",
      "The distance must be positive.",
      "invalid_distance",
    );
  return {
    gradientPercent: (input.altitudeFt / (input.distanceNm * FT_PER_NM)) * 100,
  };
};

export const approachGradientTool = createSimpleTool({
  calculate: (input) =>
    calculateApproachGradient(input as unknown as ApproachGradientInput),
  description:
    "Compute the approach path gradient in percent from altitude lost over nautical miles flown.",
  id: "aviation/approach-gradient",
  inputs: [
    {
      description: "Altitude lost during the approach segment.",
      id: "altitudeFt",
      kind: "number",
      label: "Altitude",
      unit: "ft",
    },
    {
      description: "Horizontal distance covered in the segment.",
      id: "distanceNm",
      kind: "number",
      label: "Distance",
      unit: "nm",
    },
  ],
  outputs: [
    {
      description: "Approach gradient.",
      format: "percent",
      id: "gradientPercent",
      kind: "number",
      label: "Gradient",
      unit: "%",
    },
  ],
  title: "Approach Gradient Calculator",
});
export const runApproachGradient = approachGradientTool.execute;
export default approachGradientTool;
