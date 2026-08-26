import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MastRakeAngleInput = {
  readonly referenceHeightMeters: number;
  readonly rakeMillimeters: number;
};

export type MastRakeAngleOutput = {
  readonly rakeAngleDegrees: number;
};

export const mastRakeAngleExample = {
  input: { referenceHeightMeters: 15, rakeMillimeters: 150 },
  output: { rakeAngleDegrees: 0.5729386976834859 },
} satisfies ToolExample<MastRakeAngleInput, MastRakeAngleOutput>;

export const calculateMastRakeAngle = (
  input: MastRakeAngleInput,
): MastRakeAngleOutput => {
  if (input.referenceHeightMeters <= 0)
    simpleError(
      "referenceHeightMeters",
      "The vertical reference height must be positive.",
      "invalid_input",
    );
  return {
    rakeAngleDegrees:
      (Math.atan(input.rakeMillimeters / (input.referenceHeightMeters * 1000)) *
        180) /
      Math.PI,
  };
};

export const mastRakeAngleTool = createSimpleTool({
  calculate: (input) =>
    calculateMastRakeAngle(input as unknown as MastRakeAngleInput),
  description:
    "Compute mast rake from the horizontal masthead offset and the vertical distance between the masthead and the lower measurement point.",
  id: "sailing/mast-rake-angle",
  inputs: [
    {
      description:
        "Vertical distance from the lower measurement point to the masthead.",
      format: "length-m",
      id: "referenceHeightMeters",
      kind: "number",
      label: "Reference height",
      unit: "m",
    },
    {
      description:
        "Horizontal rake offset measured from mast head to a plumb line at the boom.",
      format: "length-mm",
      id: "rakeMillimeters",
      kind: "number",
      label: "Rake",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Rake angle of the mast relative to vertical.",
      format: "angle-deg",
      id: "rakeAngleDegrees",
      kind: "number",
      label: "Rake angle",
      unit: "deg",
    },
  ],
  title: "Mast Rake Calculator",
});
export const runMastRakeAngle = mastRakeAngleTool.execute;
export default mastRakeAngleTool;
