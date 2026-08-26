import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HalfLapCrossJointInput = {
  readonly boardThicknessMm: number;
};

export type HalfLapCrossJointOutput = {
  readonly cutDepthMm: number;
  readonly lapThicknessMm: number;
};

export const halfLapCrossJointExample = {
  input: { boardThicknessMm: 19 },
  output: { cutDepthMm: 9.5, lapThicknessMm: 9.5 },
} satisfies ToolExample<HalfLapCrossJointInput, HalfLapCrossJointOutput>;

export const halfLapCrossJointTool = createSimpleTool({
  id: "carpentry/ueberblattung-kreuz-half",
  title: "Half-Lap Cross Joint Calculator",
  description:
    "Compute the lap thickness and cut depth that halve a cross-lapped board.",
  inputs: [
    {
      description: "Board thickness in millimeters.",
      id: "boardThicknessMm",
      kind: "number",
      label: "Board thickness",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Remaining material thickness of each lapped board.",
      id: "lapThicknessMm",
      kind: "number",
      label: "Lap thickness",
      unit: "mm",
    },
    {
      description: "Depth of material removed from each board face.",
      id: "cutDepthMm",
      kind: "number",
      label: "Cut depth",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const boardThicknessMm = input.boardThicknessMm as number;
    if (!(boardThicknessMm > 0))
      simpleError(
        "boardThicknessMm",
        "Board thickness must be positive.",
        "must_be_positive",
      );
    const lapThicknessMm = boardThicknessMm / 2;
    return { cutDepthMm: lapThicknessMm, lapThicknessMm };
  },
});
export const runHalfLapCrossJoint = halfLapCrossJointTool.execute;
export default halfLapCrossJointTool;
