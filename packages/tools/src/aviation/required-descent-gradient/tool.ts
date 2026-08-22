import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RequiredDescentGradientInput = {
  readonly altitudeToLoseFt: number;
  readonly distanceNm: number;
};

export type RequiredDescentGradientOutput = {
  readonly gradientFtPerNm: number;
};

export const requiredDescentGradientExample = {
  input: { altitudeToLoseFt: 10000, distanceNm: 40 },
  output: { gradientFtPerNm: 250 },
} satisfies ToolExample<
  RequiredDescentGradientInput,
  RequiredDescentGradientOutput
>;

export const calculateRequiredDescentGradient = (
  input: RequiredDescentGradientInput,
): RequiredDescentGradientOutput => {
  if (input.distanceNm <= 0)
    simpleError(
      "distanceNm",
      "The distance must be positive.",
      "invalid_distance",
    );
  if (input.altitudeToLoseFt <= 0)
    simpleError(
      "altitudeToLoseFt",
      "The altitude to lose must be positive.",
      "invalid_altitude",
    );
  return {
    gradientFtPerNm: input.altitudeToLoseFt / input.distanceNm,
  };
};

export const requiredDescentGradientTool = createSimpleTool({
  calculate: (input) =>
    calculateRequiredDescentGradient(
      input as unknown as RequiredDescentGradientInput,
    ),
  description:
    "Compute the descent gradient in feet per nautical mile needed to lose an altitude over a distance.",
  id: "aviation/required-descent-gradient",
  inputs: [
    {
      description: "Altitude to lose before the constraint.",
      id: "altitudeToLoseFt",
      kind: "number",
      label: "Altitude to lose",
      unit: "ft",
    },
    {
      description: "Horizontal distance available for the descent.",
      id: "distanceNm",
      kind: "number",
      label: "Distance",
      unit: "nm",
    },
  ],
  outputs: [
    {
      description: "Required gradient.",
      format: "gradient-ft-nm",
      id: "gradientFtPerNm",
      kind: "number",
      label: "Gradient",
      unit: "ft/nm",
    },
  ],
  title: "Required Descent Gradient Calculator",
});
export const runRequiredDescentGradient = requiredDescentGradientTool.execute;
export default requiredDescentGradientTool;
