import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HydrostaticPressureGradientBrineInput = {
  readonly brineDensityKgPerCubicMetre?: number;
  readonly gravityMetresPerSecondSquared?: number;
};

export type HydrostaticPressureGradientBrineOutput = {
  readonly gradientKilopascalsPerMetre: number;
  readonly gradientPaPerMetre: number;
};

export const calculateHydrostaticPressureGradientBrine = (
  input: HydrostaticPressureGradientBrineInput,
): HydrostaticPressureGradientBrineOutput => {
  const density = input.brineDensityKgPerCubicMetre ?? 1025;
  const gravity = input.gravityMetresPerSecondSquared ?? 9.80665;
  if (!(density > 0))
    return simpleError(
      "brineDensityKgPerCubicMetre",
      "Brine density must be greater than zero.",
      "invalid_density",
    );
  if (!(gravity > 0))
    return simpleError(
      "gravityMetresPerSecondSquared",
      "Gravity must be greater than zero.",
      "invalid_gravity",
    );
  const gradientPaPerMetre = density * gravity;
  return {
    gradientPaPerMetre,
    gradientKilopascalsPerMetre: gradientPaPerMetre / 1000,
  };
};

export const hydrostaticPressureGradientBrineExample = {
  input: {
    brineDensityKgPerCubicMetre: 1025,
    gravityMetresPerSecondSquared: 9.80665,
  },
  output: {
    gradientPaPerMetre: 10051.81625,
    gradientKilopascalsPerMetre: 10.05181625,
  },
} satisfies ToolExample<
  HydrostaticPressureGradientBrineInput,
  HydrostaticPressureGradientBrineOutput
>;

export const hydrostaticPressureGradientBrineTool = createSimpleTool({
  id: "geology/hydrostatic-pressure-gradient-brine",
  title: "Hydrostatic Pressure Gradient Brine Calculator",
  description:
    "Compute the hydrostatic pressure gradient of a brine column from its density and local gravity.",
  inputs: [
    {
      default: 1025,
      description: "Brine density in kilograms per cubic metre.",
      id: "brineDensityKgPerCubicMetre",
      kind: "number",
      label: "Brine density",
    },
    {
      default: 9.80665,
      description: "Gravitational acceleration in metres per second squared.",
      id: "gravityMetresPerSecondSquared",
      kind: "number",
      label: "Gravity",
    },
  ],
  outputs: [
    {
      description: "Hydrostatic gradient in pascals per metre.",
      id: "gradientPaPerMetre",
      kind: "number",
      label: "Gradient",
    },
    {
      description: "Hydrostatic gradient in kilopascals per metre.",
      id: "gradientKilopascalsPerMetre",
      kind: "number",
      label: "Gradient",
    },
  ],
  calculate: (input) =>
    calculateHydrostaticPressureGradientBrine(
      input as unknown as HydrostaticPressureGradientBrineInput,
    ),
});

export const runHydrostaticPressureGradientBrine =
  hydrostaticPressureGradientBrineTool.execute;
export default hydrostaticPressureGradientBrineTool;
