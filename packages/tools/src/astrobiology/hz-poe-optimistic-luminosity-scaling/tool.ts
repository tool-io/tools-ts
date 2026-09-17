import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HzPoeOptimisticLuminosityScalingInput = {
  readonly luminositySolar: number;
};

export type HzPoeOptimisticLuminosityScalingOutput = {
  readonly innerAu: number;
  readonly outerAu: number;
  readonly widthAu: number;
};

/**
 * Caltech/IPAC POE's fixed recent-Venus / early-Mars convention:
 * https://exoplanetarchive.ipac.caltech.edu/docs/poet_calculations.html
 * Stellar-effective-temperature dependence is deliberately omitted.
 */
export const calculateHzPoeOptimisticLuminosityScaling = (
  input: HzPoeOptimisticLuminosityScalingInput,
): HzPoeOptimisticLuminosityScalingOutput => {
  if (!Number.isFinite(input.luminositySolar) || input.luminositySolar <= 0)
    simpleError(
      "luminositySolar",
      "Stellar luminosity must be a finite number greater than zero.",
      "invalid_luminosity",
    );

  const scale = Math.sqrt(input.luminositySolar);
  return {
    innerAu: 0.75 * scale,
    outerAu: 1.77 * scale,
    widthAu: 1.02 * scale,
  };
};

export const hzPoeOptimisticLuminosityScalingExample = {
  input: { luminositySolar: 4 },
  output: { innerAu: 1.5, outerAu: 3.54, widthAu: 2.04 },
} satisfies ToolExample<
  HzPoeOptimisticLuminosityScalingInput,
  HzPoeOptimisticLuminosityScalingOutput
>;

export const hzPoeOptimisticLuminosityScalingTool = createSimpleTool({
  calculate: (input) =>
    calculateHzPoeOptimisticLuminosityScaling({
      luminositySolar: input.luminositySolar as number,
    }),
  description:
    "Calculate POE optimistic habitable-zone radii and width in AU from solar-unit luminosity, without temperature corrections or a habitability assessment.",
  id: "astrobiology/hz-poe-optimistic-luminosity-scaling",
  inputs: [
    {
      description:
        "Finite stellar luminosity ratio L/L_sun, strictly greater than zero.",
      id: "luminositySolar",
      kind: "number",
      label: "Stellar luminosity (solar units)",
      minimum: Number.MIN_VALUE,
      unit: "L_sun",
    },
  ],
  outputs: [
    {
      description: "Recent-Venus inner radius: 0.75 × sqrt(L/L_sun).",
      format: "length",
      id: "innerAu",
      kind: "number",
      label: "Inner radius",
      minimum: Number.MIN_VALUE,
      unit: "AU",
    },
    {
      description: "Early-Mars outer radius: 1.77 × sqrt(L/L_sun).",
      format: "length",
      id: "outerAu",
      kind: "number",
      label: "Outer radius",
      minimum: Number.MIN_VALUE,
      unit: "AU",
    },
    {
      description: "Habitable-zone width: 1.02 × sqrt(L/L_sun).",
      format: "length",
      id: "widthAu",
      kind: "number",
      label: "Width",
      minimum: Number.MIN_VALUE,
      unit: "AU",
    },
  ],
  title: "POE Optimistic Habitable Zone from Luminosity",
});

export const runHzPoeOptimisticLuminosityScaling =
  hzPoeOptimisticLuminosityScalingTool.execute;
export default hzPoeOptimisticLuminosityScalingTool;
