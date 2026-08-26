import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const carcasePanelCountExample = {
  input: { depthMm: 450, heightMm: 720, panelThicknessMm: 19, widthMm: 800 },
  output: {
    backCount: 1,
    backPanelRevealMm: 19,
    bottomCount: 1,
    leftSideCount: 1,
    rightSideCount: 1,
    topCount: 1,
  },
} satisfies ToolExample<
  {
    readonly depthMm: number;
    readonly heightMm: number;
    readonly panelThicknessMm: number;
    readonly widthMm: number;
  },
  {
    readonly backCount: number;
    readonly backPanelRevealMm: number;
    readonly bottomCount: number;
    readonly leftSideCount: number;
    readonly rightSideCount: number;
    readonly topCount: number;
  }
>;

export const carcasePanelCountTool = createSimpleTool({
  id: "carpentry/korpus-stueckliste-seiten-boden-deckel",
  title: "Carcase Panel Count Generator",
  description:
    "Count the side, top, bottom, and back panels of a box carcase with a one-thickness back reveal.",
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
    { id: "leftSideCount", kind: "integer", label: "Left sides" },
    { id: "rightSideCount", kind: "integer", label: "Right sides" },
    { id: "bottomCount", kind: "integer", label: "Bottoms" },
    { id: "topCount", kind: "integer", label: "Tops" },
    { id: "backCount", kind: "integer", label: "Backs" },
    {
      id: "backPanelRevealMm",
      kind: "number",
      label: "Back panel reveal",
      unit: "mm",
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
      backCount: 1,
      backPanelRevealMm: panelThicknessMm,
      bottomCount: 1,
      leftSideCount: 1,
      rightSideCount: 1,
      topCount: 1,
    };
  },
});
export const runCarcasePanelCount = carcasePanelCountTool.execute;
export default carcasePanelCountTool;
