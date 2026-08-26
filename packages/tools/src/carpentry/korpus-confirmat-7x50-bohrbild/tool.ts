import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConfirmatDrillingPatternInput = {
  readonly boardThicknessMm: number;
};

export type ConfirmatDrillingPatternOutput = {
  readonly pilotHoleDiameterMm: number;
  readonly drillingDepthMm: number;
};

export const confirmatDrillingExample = {
  input: { boardThicknessMm: 19 },
  output: { pilotHoleDiameterMm: 5, drillingDepthMm: 55 },
} satisfies ToolExample<
  ConfirmatDrillingPatternInput,
  ConfirmatDrillingPatternOutput
>;

export const confirmatDrillingTool = createSimpleTool({
  id: "carpentry/korpus-confirmat-7x50-bohrbild",
  title: "Confirmat Drilling Pattern",
  description:
    "Compute the drilling pattern for a 7x50 confirmat connector in chipboard.",
  inputs: [
    {
      description: "Board thickness of the panel to be joined in millimeters.",
      id: "boardThicknessMm",
      kind: "number",
      label: "Board thickness",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Confirmat pilot hole diameter in millimeters.",
      id: "pilotHoleDiameterMm",
      kind: "number",
      label: "Pilot hole diameter",
      unit: "mm",
    },
    {
      description: "Confirmat drilling depth in millimeters.",
      id: "drillingDepthMm",
      kind: "number",
      label: "Drilling depth",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const boardThicknessMm = input.boardThicknessMm as number;
    if (boardThicknessMm < 16)
      simpleError(
        "boardThicknessMm",
        "Board thickness must be at least 16 mm for a 7x50 confirmat screw.",
        "board_too_thin",
      );
    return { pilotHoleDiameterMm: 5, drillingDepthMm: 55 };
  },
});
export const runConfirmatDrilling = confirmatDrillingTool.execute;
export default confirmatDrillingTool;
