import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RakingLightAngleOptimizerInput = {
  readonly reliefHeightMm: number;
  readonly targetShadowLengthMm: number;
};

export type RakingLightAngleOptimizerOutput = {
  readonly tangentRatio: number;
  readonly rakeAngleDeg: number;
};

export const calculateRakingLightAngleOptimizer = (
  input: RakingLightAngleOptimizerInput,
): RakingLightAngleOptimizerOutput => {
  if (!(input.reliefHeightMm > 0))
    return simpleError(
      "reliefHeightMm",
      "Relief height must be greater than zero.",
      "invalid_height",
    );
  if (!(input.targetShadowLengthMm > 0))
    return simpleError(
      "targetShadowLengthMm",
      "Target shadow length must be greater than zero.",
      "invalid_shadow",
    );
  const tangentRatio = input.reliefHeightMm / input.targetShadowLengthMm;
  return {
    tangentRatio,
    rakeAngleDeg: (Math.atan(tangentRatio) * 180) / Math.PI,
  };
};

export const rakingLightAngleOptimizerExample = {
  input: { reliefHeightMm: 2, targetShadowLengthMm: 10 },
  output: { tangentRatio: 0.2, rakeAngleDeg: 11.309932474020213 },
} satisfies ToolExample<
  RakingLightAngleOptimizerInput,
  RakingLightAngleOptimizerOutput
>;

export const rakingLightAngleOptimizerTool = createSimpleTool({
  id: "epigraphy/raking-light-angle-optimizer",
  title: "Raking Light Angle Shadow Contrast Optimizer",
  description:
    "Compute the raking-light incidence angle that casts a shadow of a chosen length across carved relief of a given height.",
  inputs: [
    {
      description: "Relief height of the carving in millimeters.",
      id: "reliefHeightMm",
      kind: "number",
      label: "Relief height",
      unit: "mm",
    },
    {
      description: "Desired shadow length across the surface in millimeters.",
      id: "targetShadowLengthMm",
      kind: "number",
      label: "Shadow length",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description:
        "Height divided by shadow length (tangent of the rake angle).",
      id: "tangentRatio",
      kind: "number",
      label: "tan(angle)",
    },
    {
      description: "Grazing incidence angle above the surface in degrees.",
      id: "rakeAngleDeg",
      kind: "number",
      label: "Rake angle",
      unit: "°",
    },
  ],
  calculate: (input) =>
    calculateRakingLightAngleOptimizer(
      input as unknown as RakingLightAngleOptimizerInput,
    ),
});

export const runRakingLightAngleOptimizer =
  rakingLightAngleOptimizerTool.execute;
export default rakingLightAngleOptimizerTool;
