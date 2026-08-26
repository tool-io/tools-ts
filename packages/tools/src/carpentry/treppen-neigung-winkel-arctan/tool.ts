import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StairPitchAngleInput = {
  readonly riseCm: number;
  readonly runCm: number;
};

export type StairPitchAngleOutput = {
  readonly angleDegrees: number;
};

export const stairPitchAngleExample = {
  input: { riseCm: 17, runCm: 29 },
  output: { angleDegrees: 30.379126011368346 },
} satisfies ToolExample<StairPitchAngleInput, StairPitchAngleOutput>;

export const stairPitchAngleTool = createSimpleTool({
  id: "carpentry/treppen-neigung-winkel-arctan",
  title: "Stair Pitch Angle Calculator",
  description:
    "Compute the stair pitch angle in degrees as the arctangent of the rise over the run.",
  inputs: [
    {
      description: "Riser height per step in centimeters.",
      id: "riseCm",
      kind: "number",
      label: "Rise",
      unit: "cm",
    },
    {
      description: "Tread depth per step in centimeters.",
      id: "runCm",
      kind: "number",
      label: "Run",
      unit: "cm",
    },
  ],
  outputs: [
    {
      description:
        "Stair pitch angle in degrees, arctangent of rise divided by run.",
      id: "angleDegrees",
      kind: "number",
      label: "Pitch angle",
      unit: "°",
    },
  ],
  calculate: (input) => {
    const riseCm = input.riseCm as number;
    const runCm = input.runCm as number;
    if (!(riseCm > 0))
      simpleError(
        "riseCm",
        "Rise must be greater than zero.",
        "must_be_positive",
      );
    if (!(runCm > 0))
      simpleError(
        "runCm",
        "Run must be greater than zero.",
        "must_be_positive",
      );
    return { angleDegrees: (Math.atan(riseCm / runCm) * 180) / Math.PI };
  },
});
export const runStairPitchAngle = stairPitchAngleTool.execute;
export default stairPitchAngleTool;
