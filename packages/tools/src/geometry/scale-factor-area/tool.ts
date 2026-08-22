import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const scaleFactorAreaExample = {
  input: { originalArea: 10, scaleFactor: 3 },
  output: { scaledArea: 90 },
} satisfies ToolExample<ScaleFactorAreaInput, ScaleFactorAreaOutput>;

export type ScaleFactorAreaInput = {
  readonly originalArea: number;
  readonly scaleFactor: number;
};
export type ScaleFactorAreaOutput = { readonly scaledArea: number };

export const calculateScaleFactorArea = (
  input: ScaleFactorAreaInput,
): ScaleFactorAreaOutput => {
  if (input.scaleFactor < 0 || input.originalArea < 0)
    simpleError(
      "originalArea",
      "Original area and scale factor must be non-negative.",
      "invalid_input",
    );
  return {
    scaledArea: input.originalArea * input.scaleFactor ** 2,
  };
};

export const scaleFactorAreaTool = createSimpleTool({
  calculate: (input) =>
    calculateScaleFactorArea(input as unknown as ScaleFactorAreaInput),
  description:
    "Compute the new area when a shape's linear dimensions are scaled by a factor.",
  id: "geometry/scale-factor-area",
  inputs: [
    { id: "originalArea", kind: "number", label: "Original area", minimum: 0 },
    { id: "scaleFactor", kind: "number", label: "Scale factor", minimum: 0 },
  ],
  outputs: [{ id: "scaledArea", kind: "number", label: "Scaled area" }],
  title: "Scale Factor Area Calculator",
});
export const runScaleFactorArea = scaleFactorAreaTool.execute;
export default scaleFactorAreaTool;
