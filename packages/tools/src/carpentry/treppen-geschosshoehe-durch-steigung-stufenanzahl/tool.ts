import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StepCountFromFloorHeightInput = {
  readonly floorHeightCm: number;
  readonly targetRiseCm: number;
};

export type StepCountFromFloorHeightOutput = {
  readonly actualRiseCm: number;
  readonly stepCount: number;
};

export const stepCountFromFloorHeightExample = {
  input: { floorHeightCm: 288, targetRiseCm: 18 },
  output: { actualRiseCm: 18, stepCount: 16 },
} satisfies ToolExample<
  StepCountFromFloorHeightInput,
  StepCountFromFloorHeightOutput
>;

export const stepCountFromFloorHeightTool = createSimpleTool({
  id: "carpentry/treppen-geschosshoehe-durch-steigung-stufenanzahl",
  title: "Step Count From Floor Height",
  description:
    "Divide a floor height by a target riser height to get the rounded-up step count and the resulting actual riser height.",
  inputs: [
    {
      description: "Total floor-to-floor height in centimeters.",
      id: "floorHeightCm",
      kind: "number",
      label: "Floor height",
      unit: "cm",
    },
    {
      description: "Target riser height in centimeters between 10 and 25.",
      id: "targetRiseCm",
      kind: "number",
      label: "Target rise",
      maximum: 25,
      minimum: 10,
      unit: "cm",
    },
  ],
  outputs: [
    {
      description:
        "Number of steps, the floor height divided by the target rise and rounded up.",
      id: "stepCount",
      kind: "integer",
      label: "Step count",
    },
    {
      description:
        "Actual riser height in centimeters, the floor height divided by the step count.",
      id: "actualRiseCm",
      kind: "number",
      label: "Actual rise",
      unit: "cm",
    },
  ],
  calculate: (input) => {
    const floorHeightCm = input.floorHeightCm as number;
    if (!(floorHeightCm > 0))
      simpleError(
        "floorHeightCm",
        "Floor height must be greater than zero.",
        "must_be_positive",
      );
    const targetRiseCm = input.targetRiseCm as number;
    const stepCount = Math.ceil(floorHeightCm / targetRiseCm);
    return { actualRiseCm: floorHeightCm / stepCount, stepCount };
  },
});
export const runStepCountFromFloorHeight = stepCountFromFloorHeightTool.execute;
export default stepCountFromFloorHeightTool;
