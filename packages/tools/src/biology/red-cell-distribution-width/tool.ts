import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type RedCellDistributionWidthInput = {
  readonly rbcVolumeSdFemtoliters: number;
  readonly mcvFemtoliters: number;
};

export type RedCellDistributionWidthOutput = {
  readonly rdwCvPercent: number;
};

export const redCellDistributionWidthExample = {
  input: { rbcVolumeSdFemtoliters: 12, mcvFemtoliters: 90 },
  output: { rdwCvPercent: 13.333333333333334 },
} satisfies ToolExample<
  RedCellDistributionWidthInput,
  RedCellDistributionWidthOutput
>;

export const redCellDistributionWidthTool = createSimpleTool({
  id: "biology/red-cell-distribution-width",
  title: "RDW-CV Percent",
  description:
    "Compute red cell distribution width CV from RBC volume standard deviation and MCV.",
  inputs: [
    {
      id: "rbcVolumeSdFemtoliters",
      kind: "number",
      label: "RBC volume standard deviation",
      minimum: 0,
      unit: "fL",
    },
    {
      id: "mcvFemtoliters",
      kind: "number",
      label: "Mean corpuscular volume",
      minimum: Number.MIN_VALUE,
      unit: "fL",
    },
  ],
  outputs: [
    {
      id: "rdwCvPercent",
      kind: "number",
      label: "Red cell distribution width CV",
      unit: "%",
    },
  ],
  calculate: (input) => ({
    rdwCvPercent:
      ((input.rbcVolumeSdFemtoliters as number) /
        (input.mcvFemtoliters as number)) *
      100,
  }),
});
export const runRedCellDistributionWidth = redCellDistributionWidthTool.execute;
export default redCellDistributionWidthTool;
