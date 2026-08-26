import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChamferWidthInput = {
  readonly angleDegrees?: number;
  readonly depthMm: number;
};

export type ChamferWidthOutput = {
  readonly chamferWidthMm: number;
};

export const chamferWidthExample = {
  input: { angleDegrees: 45, depthMm: 4 },
  output: { chamferWidthMm: 3.9999999999999996 },
} satisfies ToolExample<ChamferWidthInput, ChamferWidthOutput>;

export const chamferWidthTool = createSimpleTool({
  id: "carpentry/fase-breite-45grad",
  title: "Chamfer Width Calculator",
  description:
    "Calculate the resulting chamfer width from chamfer depth and angle in degrees.",
  inputs: [
    {
      id: "depthMm",
      kind: "number",
      label: "Chamfer depth",
      unit: "mm",
    },
    {
      default: 45,
      description: "Chamfer angle relative to the surface in degrees.",
      id: "angleDegrees",
      kind: "number",
      label: "Angle",
      maximum: 89,
      minimum: 1,
      unit: "°",
    },
  ],
  outputs: [
    {
      id: "chamferWidthMm",
      kind: "number",
      label: "Chamfer width",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const depthMm = input.depthMm as number;
    const angleDegrees = input.angleDegrees as number;
    if (!(depthMm > 0))
      simpleError(
        "depthMm",
        "Chamfer depth must be greater than zero.",
        "invalid_depth",
      );
    return {
      chamferWidthMm: depthMm * Math.tan((angleDegrees * Math.PI) / 180),
    };
  },
});
export const runChamferWidth = chamferWidthTool.execute;
export default chamferWidthTool;
