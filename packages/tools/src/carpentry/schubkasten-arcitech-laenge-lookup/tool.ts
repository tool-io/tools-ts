import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DrawerSideLengthInput = {
  readonly frontWidthMm: number;
};

export type DrawerSideLengthOutput = {
  readonly sideLengthMm: number;
};

const ARCITECH_CLEARANCE_MM = 54;

export const drawerSideLengthExample = {
  input: { frontWidthMm: 600 },
  output: { sideLengthMm: 546 },
} satisfies ToolExample<DrawerSideLengthInput, DrawerSideLengthOutput>;

export const drawerSideLengthTool = createSimpleTool({
  id: "carpentry/schubkasten-arcitech-laenge-lookup",
  title: "Drawer Side Length Rule",
  description:
    "Compute the slim drawer side length by subtracting 54 millimeters from the front width.",
  inputs: [
    {
      description: "Drawer front width in millimeters.",
      id: "frontWidthMm",
      kind: "number",
      label: "Front width",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Drawer side length in millimeters.",
      id: "sideLengthMm",
      kind: "number",
      label: "Side length",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const frontWidthMm = input.frontWidthMm as number;
    if (!(frontWidthMm > ARCITECH_CLEARANCE_MM))
      simpleError(
        "frontWidthMm",
        "Front width must be greater than 54 millimeters.",
        "must_exceed_54",
      );
    return { sideLengthMm: frontWidthMm - ARCITECH_CLEARANCE_MM };
  },
});
export const runDrawerSideLength = drawerSideLengthTool.execute;
export default drawerSideLengthTool;
