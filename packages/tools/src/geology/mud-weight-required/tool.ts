import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MudWeightRequiredInput = {
  readonly gravityMetresPerSecondSquared?: number;
  readonly porePressureMegapascals: number;
  readonly tripMarginKgPerCubicMetre?: number;
  readonly trueVerticalDepthMetres: number;
};

export type MudWeightRequiredOutput = {
  readonly requiredMudDensityKgPerCubicMetre: number;
  readonly requiredPressureGradientPaPerMetre: number;
};

export const calculateMudWeightRequired = (
  input: MudWeightRequiredInput,
): MudWeightRequiredOutput => {
  const gravity = input.gravityMetresPerSecondSquared ?? 9.80665;
  const margin = input.tripMarginKgPerCubicMetre ?? 20;
  if (!(input.porePressureMegapascals >= 0))
    return simpleError(
      "porePressureMegapascals",
      "Pore pressure cannot be negative.",
      "invalid_pressure",
    );
  if (!(input.trueVerticalDepthMetres > 0))
    return simpleError(
      "trueVerticalDepthMetres",
      "True vertical depth must be greater than zero.",
      "invalid_depth",
    );
  if (!(gravity > 0))
    return simpleError(
      "gravityMetresPerSecondSquared",
      "Gravity must be greater than zero.",
      "invalid_gravity",
    );
  if (!(margin >= 0))
    return simpleError(
      "tripMarginKgPerCubicMetre",
      "Trip margin cannot be negative.",
      "invalid_margin",
    );
  const requiredMudDensityKgPerCubicMetre =
    (input.porePressureMegapascals * 1e6) /
      (gravity * input.trueVerticalDepthMetres) +
    margin;
  return {
    requiredMudDensityKgPerCubicMetre,
    requiredPressureGradientPaPerMetre:
      requiredMudDensityKgPerCubicMetre * gravity,
  };
};

export const mudWeightRequiredExample = {
  input: {
    porePressureMegapascals: 32.044,
    trueVerticalDepthMetres: 2000,
  },
  output: {
    requiredMudDensityKgPerCubicMetre: 1653.7893164332365,
    requiredPressureGradientPaPerMetre: 16218.132999999998,
  },
} satisfies ToolExample<MudWeightRequiredInput, MudWeightRequiredOutput>;

export const mudWeightRequiredTool = createSimpleTool({
  id: "geology/mud-weight-required",
  title: "Mud Weight Required Calculator",
  description:
    "Determine the mud density needed to balance a known pore pressure at depth, including an optional trip margin.",
  inputs: [
    {
      description: "Pore pressure to control in megapascals.",
      id: "porePressureMegapascals",
      kind: "number",
      label: "Pore pressure",
      minimum: 0,
    },
    {
      description: "True vertical depth in metres.",
      id: "trueVerticalDepthMetres",
      kind: "number",
      label: "TVD",
    },
    {
      default: 20,
      description:
        "Safety (trip) margin added to the balance density in kilograms per cubic metre.",
      id: "tripMarginKgPerCubicMetre",
      kind: "number",
      label: "Trip margin",
      minimum: 0,
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
      description: "Required mud density in kilograms per cubic metre.",
      id: "requiredMudDensityKgPerCubicMetre",
      kind: "number",
      label: "Required mud weight",
    },
    {
      description: "Equivalent mud pressure gradient in pascals per metre.",
      id: "requiredPressureGradientPaPerMetre",
      kind: "number",
      label: "Required gradient",
    },
  ],
  calculate: (input) =>
    calculateMudWeightRequired(input as unknown as MudWeightRequiredInput),
});

export const runMudWeightRequired = mudWeightRequiredTool.execute;
export default mudWeightRequiredTool;
