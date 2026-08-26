import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BackPanelGrooveDepthInput = {
  readonly panelThicknessMm: number;
};

export type BackPanelGrooveDepthOutput = {
  readonly grooveDepthMm: number;
};

export const backPanelGrooveDepthExample = {
  input: { panelThicknessMm: 19 },
  output: { grooveDepthMm: 9.5 },
} satisfies ToolExample<BackPanelGrooveDepthInput, BackPanelGrooveDepthOutput>;

export const backPanelGrooveDepthTool = createSimpleTool({
  id: "carpentry/gratleiste-nut-tiefe",
  title: "Back Panel Groove Depth Calculator",
  description:
    "Compute the groove depth that holds a back panel at half its thickness.",
  inputs: [
    {
      description: "Back panel thickness in millimeters.",
      id: "panelThicknessMm",
      kind: "number",
      label: "Panel thickness",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Groove depth in millimeters.",
      id: "grooveDepthMm",
      kind: "number",
      label: "Groove depth",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const panelThicknessMm = input.panelThicknessMm as number;
    if (!(panelThicknessMm > 0))
      simpleError(
        "panelThicknessMm",
        "Panel thickness must be positive.",
        "must_be_positive",
      );
    return { grooveDepthMm: panelThicknessMm / 2 };
  },
});
export const runBackPanelGrooveDepth = backPanelGrooveDepthTool.execute;
export default backPanelGrooveDepthTool;
