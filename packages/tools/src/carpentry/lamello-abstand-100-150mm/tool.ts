import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BiscuitSpacingInput = {
  readonly panelLengthMm: number;
};

export type BiscuitSpacingOutput = {
  readonly recommendedSpacingMm: number;
};

const SHORT_PANEL_LIMIT_MM = 1000;
const SHORT_PANEL_SPACING_MM = 100;
const LONG_PANEL_SPACING_MM = 150;

export const biscuitSpacingExample = {
  input: { panelLengthMm: 2400 },
  output: { recommendedSpacingMm: 150 },
} satisfies ToolExample<BiscuitSpacingInput, BiscuitSpacingOutput>;

export const biscuitSpacingTool = createSimpleTool({
  id: "carpentry/lamello-abstand-100-150mm",
  title: "Biscuit Spacing Rule Calculator",
  description:
    "Recommend a biscuit spacing of 100 mm for panels up to one meter and 150 mm for longer panels.",
  inputs: [
    {
      description: "Panel length in millimeters.",
      id: "panelLengthMm",
      kind: "number",
      label: "Panel length",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Recommended spacing between biscuits in millimeters.",
      id: "recommendedSpacingMm",
      kind: "number",
      label: "Recommended spacing",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const panelLengthMm = input.panelLengthMm as number;
    if (!(panelLengthMm > 0))
      simpleError(
        "panelLengthMm",
        "Panel length must be greater than zero.",
        "must_be_positive",
      );
    return {
      recommendedSpacingMm:
        panelLengthMm <= SHORT_PANEL_LIMIT_MM
          ? SHORT_PANEL_SPACING_MM
          : LONG_PANEL_SPACING_MM,
    };
  },
});
export const runBiscuitSpacing = biscuitSpacingTool.execute;
export default biscuitSpacingTool;
