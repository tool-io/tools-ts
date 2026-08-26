import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MinifixThicknessClass = "16" | "18" | "19";

export type MinifixPatternInput = {
  readonly panelThicknessClass: MinifixThicknessClass;
};

export type MinifixPatternOutput = {
  readonly camHousingDepthMm: number;
  readonly camHousingDiameterMm: number;
  readonly lineBoringDistanceMm: number;
  readonly shaftDiameterMm: number;
};

const MINIFIX_PATTERN = {
  camHousingDepthMm: 12.5,
  camHousingDiameterMm: 15,
  lineBoringDistanceMm: 34,
  shaftDiameterMm: 8,
} as const;

export const minifixPatternExample = {
  input: { panelThicknessClass: "18" },
  output: MINIFIX_PATTERN,
} satisfies ToolExample<MinifixPatternInput, MinifixPatternOutput>;

export const minifixPatternTool = createSimpleTool({
  id: "carpentry/minifix-bohrbild-34mm",
  title: "Minifix 34mm Drilling Pattern",
  description:
    "Look up the fixed Minifix 34 mm drilling pattern for 16, 18, and 19 millimeter panels.",
  inputs: [
    {
      description: "Panel thickness class in millimeters: 16, 18, or 19.",
      enum: ["16", "18", "19"],
      id: "panelThicknessClass",
      kind: "string",
      label: "Panel thickness class",
    },
  ],
  outputs: [
    {
      description:
        "Distance between the shelf pin hole and the cam housing center in millimeters.",
      id: "lineBoringDistanceMm",
      kind: "number",
      label: "Line boring distance",
      unit: "mm",
    },
    {
      description: "Cam housing diameter in millimeters.",
      id: "camHousingDiameterMm",
      kind: "number",
      label: "Cam housing diameter",
      unit: "mm",
    },
    {
      description: "Cam housing depth in millimeters.",
      id: "camHousingDepthMm",
      kind: "number",
      label: "Cam housing depth",
      unit: "mm",
    },
    {
      description: "Connecting bolt shaft diameter in millimeters.",
      id: "shaftDiameterMm",
      kind: "number",
      label: "Shaft diameter",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const panelThicknessClass =
      input.panelThicknessClass as MinifixThicknessClass;
    if (!["16", "18", "19"].includes(panelThicknessClass))
      simpleError(
        "panelThicknessClass",
        "Unknown panel thickness class.",
        "unknown_class",
      );
    return MINIFIX_PATTERN;
  },
});
export const runMinifixPattern = minifixPatternTool.execute;
export default minifixPatternTool;
