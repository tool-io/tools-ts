import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const drawerBomExample = {
  input: { depthMm: 450, heightMm: 120, widthMm: 500 },
  output: {
    bottomCount: 1,
    frontBackCount: 2,
    sideCount: 2,
    totalPanelAreaM2: 0.453,
  },
} satisfies ToolExample<
  {
    readonly depthMm: number;
    readonly heightMm: number;
    readonly widthMm: number;
  },
  {
    readonly bottomCount: number;
    readonly frontBackCount: number;
    readonly sideCount: number;
    readonly totalPanelAreaM2: number;
  }
>;

export const drawerBomTool = createSimpleTool({
  id: "carpentry/stueckliste-schubkasten-generator",
  title: "Drawer Bill of Materials Generator",
  description:
    "Generate the bill of materials for a drawer from inner width, depth, and height.",
  inputs: [
    { id: "widthMm", kind: "number", label: "Inner width", unit: "mm" },
    { id: "depthMm", kind: "number", label: "Inner depth", unit: "mm" },
    { id: "heightMm", kind: "number", label: "Inner height", unit: "mm" },
  ],
  outputs: [
    { id: "frontBackCount", kind: "integer", label: "Front and back panels" },
    { id: "sideCount", kind: "integer", label: "Side panels" },
    { id: "bottomCount", kind: "integer", label: "Bottom panels" },
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
    const depthMm = input.depthMm as number;
    const heightMm = input.heightMm as number;
    if (!(widthMm > 0) || !(depthMm > 0) || !(heightMm > 0))
      simpleError(
        "widthMm",
        "All drawer dimensions must be positive.",
        "invalid_dimensions",
      );
    return {
      bottomCount: 1,
      frontBackCount: 2,
      sideCount: 2,
      totalPanelAreaM2:
        (2 * widthMm * heightMm + 2 * depthMm * heightMm + widthMm * depthMm) /
        1e6,
    };
  },
});
export const runDrawerBom = drawerBomTool.execute;
export default drawerBomTool;
