import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WoodDefectWasteInput = {
  readonly boardAreaM2: number;
  readonly defectAreaM2: number;
};

export type WoodDefectWasteOutput = {
  readonly defectWastePercent: number;
};

export const woodDefectWasteExample = {
  input: { boardAreaM2: 2, defectAreaM2: 0.5 },
  output: { defectWastePercent: 25 },
} satisfies ToolExample<WoodDefectWasteInput, WoodDefectWasteOutput>;

export const woodDefectWasteTool = createSimpleTool({
  id: "carpentry/holzfehler-ausschuss-prozent",
  title: "Wood Defect Waste Percentage Calculator",
  description:
    "Compute the waste percentage of a board caused by defects from defect area and total board area.",
  inputs: [
    {
      description: "Total usable board area in square metres.",
      id: "boardAreaM2",
      kind: "number",
      label: "Board area",
      unit: "m²",
    },
    {
      description:
        "Area covered by knots, cracks, and other defects in square metres.",
      id: "defectAreaM2",
      kind: "number",
      label: "Defect area",
      minimum: 0,
      unit: "m²",
    },
  ],
  outputs: [
    {
      description: "Share of the board lost to defects in percent.",
      format: "percent",
      id: "defectWastePercent",
      kind: "number",
      label: "Defect waste",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const boardAreaM2 = input.boardAreaM2 as number;
    if (boardAreaM2 <= 0)
      simpleError(
        "boardAreaM2",
        "The board area must be greater than zero square metres.",
        "invalid_board_area",
      );
    const defectAreaM2 = input.defectAreaM2 as number;
    if (defectAreaM2 > boardAreaM2)
      simpleError(
        "defectAreaM2",
        "The defect area must not exceed the board area.",
        "invalid_defect_area",
      );
    return { defectWastePercent: (defectAreaM2 / boardAreaM2) * 100 };
  },
});
export const runWoodDefectWaste = woodDefectWasteTool.execute;
export default woodDefectWasteTool;
