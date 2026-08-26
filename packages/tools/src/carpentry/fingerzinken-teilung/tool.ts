import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BoxJointPitchInput = {
  readonly desiredPitchMm: number;
  readonly jointWidthMm: number;
};

export type BoxJointPitchOutput = {
  readonly adjustedPitchMm: number;
  readonly pinCount: number;
};

export const boxJointPitchExample = {
  input: { desiredPitchMm: 12, jointWidthMm: 100 },
  output: { adjustedPitchMm: 12.5, pinCount: 8 },
} satisfies ToolExample<BoxJointPitchInput, BoxJointPitchOutput>;

export const boxJointPitchTool = createSimpleTool({
  id: "carpentry/fingerzinken-teilung",
  title: "Box Joint Pitch Calculator",
  description:
    "Compute an even finger joint pitch that fits a whole pin count into the joint width.",
  inputs: [
    {
      description: "Width of the jointed workpiece in millimeters.",
      id: "jointWidthMm",
      kind: "number",
      label: "Joint width",
      unit: "mm",
    },
    {
      description: "Desired distance between pin centers in millimeters.",
      id: "desiredPitchMm",
      kind: "number",
      label: "Desired pitch",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Whole number of pins that fit the joint width.",
      id: "pinCount",
      kind: "integer",
      label: "Pin count",
    },
    {
      description: "Evenly distributed pitch in millimeters.",
      id: "adjustedPitchMm",
      kind: "number",
      label: "Adjusted pitch",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const jointWidthMm = input.jointWidthMm as number;
    const desiredPitchMm = input.desiredPitchMm as number;
    if (!(jointWidthMm > 0))
      simpleError(
        "jointWidthMm",
        "Joint width must be positive.",
        "must_be_positive",
      );
    if (!(desiredPitchMm > 0))
      simpleError(
        "desiredPitchMm",
        "Desired pitch must be positive.",
        "must_be_positive",
      );
    const pinCount = Math.max(2, Math.round(jointWidthMm / desiredPitchMm));
    return { adjustedPitchMm: jointWidthMm / pinCount, pinCount };
  },
});
export const runBoxJointPitch = boxJointPitchTool.execute;
export default boxJointPitchTool;
