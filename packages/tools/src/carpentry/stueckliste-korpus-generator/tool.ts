import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const carcaseBomExample = {
  input: { depthMm: 450, heightMm: 720, panelThicknessMm: 19, widthMm: 800 },
  output: {
    backPanelCount: 1,
    sidePanelCount: 2,
    topBottomCount: 2,
    totalPanelAreaM2: 1.944,
  },
} satisfies ToolExample<
  {
    readonly depthMm: number;
    readonly heightMm: number;
    readonly panelThicknessMm: number;
    readonly widthMm: number;
  },
  {
    readonly backPanelCount: number;
    readonly sidePanelCount: number;
    readonly topBottomCount: number;
    readonly totalPanelAreaM2: number;
  }
>;

export const carcaseBomTool = createSimpleTool({
  id: "carpentry/stueckliste-korpus-generator",
  title: "Carcase Bill of Materials Generator",
  description:
    "Generate the bill of materials for a rectangular box carcase from outer dimensions and panel thickness.",
  inputs: [
    { id: "widthMm", kind: "number", label: "Outer width", unit: "mm" },
    { id: "heightMm", kind: "number", label: "Outer height", unit: "mm" },
    { id: "depthMm", kind: "number", label: "Outer depth", unit: "mm" },
    {
      id: "panelThicknessMm",
      kind: "number",
      label: "Panel thickness",
      unit: "mm",
    },
  ],
  outputs: [
    { id: "sidePanelCount", kind: "integer", label: "Side panels" },
    { id: "topBottomCount", kind: "integer", label: "Top and bottom panels" },
    { id: "backPanelCount", kind: "integer", label: "Back panels" },
    {
      format: "area",
      id: "totalPanelAreaM2",
      kind: "number",
      label: "Total panel area",
      unit: "m²",
    },
  ],
  calculate: (input) => {
    const widthMm = input.widthMm as number;
    const heightMm = input.heightMm as number;
    const depthMm = input.depthMm as number;
    const panelThicknessMm = input.panelThicknessMm as number;
    if (
      !(widthMm > 0) ||
      !(heightMm > 0) ||
      !(depthMm > 0) ||
      !(panelThicknessMm > 0)
    )
      simpleError(
        "widthMm",
        "All dimensions and the panel thickness must be positive.",
        "invalid_dimensions",
      );
    return {
      backPanelCount: 1,
      sidePanelCount: 2,
      topBottomCount: 2,
      totalPanelAreaM2:
        (2 * depthMm * heightMm + 2 * widthMm * depthMm + widthMm * heightMm) /
        1e6,
    };
  },
});
export const runCarcaseBom = carcaseBomTool.execute;
export default carcaseBomTool;
