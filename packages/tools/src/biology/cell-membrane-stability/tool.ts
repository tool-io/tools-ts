import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CellMembraneStabilityInput = {
  readonly ratioControl: number;
  readonly ratioTreated: number;
};

export type CellMembraneStabilityOutput = {
  readonly cellMembraneStabilityPercent: number;
};

export const cellMembraneStabilityExample = {
  input: { ratioControl: 0.6, ratioTreated: 0.75 },
  output: { cellMembraneStabilityPercent: 80 },
} satisfies ToolExample<
  CellMembraneStabilityInput,
  CellMembraneStabilityOutput
>;

export const cellMembraneStabilityTool = createSimpleTool({
  id: "biology/cell-membrane-stability",
  title: "CMS Percent",
  description:
    "Compute cell membrane stability as a percentage by comparing the control conductivity ratio to the treated conductivity ratio, control divided by treated times one hundred, clamped to the range zero through one hundred.",
  inputs: [
    {
      description: "Control conductivity ratio between 0 and 1.",
      id: "ratioControl",
      kind: "number",
      label: "Control ratio",
      maximum: 1,
      minimum: 0,
    },
    {
      description:
        "Treated conductivity ratio between 0 and 1; must be greater than zero.",
      id: "ratioTreated",
      kind: "number",
      label: "Treated ratio",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Cell membrane stability percentage clamped to 0 through 100.",
      id: "cellMembraneStabilityPercent",
      kind: "number",
      label: "Cell membrane stability",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const ratioControl = input.ratioControl as number;
    const ratioTreated = input.ratioTreated as number;
    if (!(ratioTreated > 0))
      simpleError(
        "ratioTreated",
        "The treated ratio must be greater than zero.",
      );
    return {
      cellMembraneStabilityPercent: Math.min(
        100,
        Math.max(0, (ratioControl / ratioTreated) * 100),
      ),
    };
  },
});
export const runCellMembraneStability = cellMembraneStabilityTool.execute;
export default cellMembraneStabilityTool;
