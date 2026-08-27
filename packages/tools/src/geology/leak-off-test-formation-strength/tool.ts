import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeakOffTestFormationStrengthInput = {
  readonly gravityMetresPerSecondSquared?: number;
  readonly mudDensityKgPerCubicMetre: number;
  readonly shoeDepthMetres: number;
  readonly surfaceLeakOffPressurePa: number;
};

export type LeakOffTestFormationStrengthOutput = {
  readonly equivalentMudDensityKgPerCubicMetre: number;
  readonly formationStrengthPa: number;
  readonly fractureGradientPaPerMetre: number;
};

export const calculateLeakOffTestFormationStrength = (
  input: LeakOffTestFormationStrengthInput,
): LeakOffTestFormationStrengthOutput => {
  const gravity = input.gravityMetresPerSecondSquared ?? 9.80665;
  if (!(input.mudDensityKgPerCubicMetre > 0))
    return simpleError(
      "mudDensityKgPerCubicMetre",
      "Mud density must be greater than zero.",
      "invalid_density",
    );
  if (!(input.shoeDepthMetres > 0))
    return simpleError(
      "shoeDepthMetres",
      "Shoe depth must be greater than zero.",
      "invalid_depth",
    );
  if (!(input.surfaceLeakOffPressurePa >= 0))
    return simpleError(
      "surfaceLeakOffPressurePa",
      "Surface leak-off pressure cannot be negative.",
      "invalid_pressure",
    );
  if (!(gravity > 0))
    return simpleError(
      "gravityMetresPerSecondSquared",
      "Gravity must be greater than zero.",
      "invalid_gravity",
    );
  const hydrostaticAtShoe =
    input.mudDensityKgPerCubicMetre * gravity * input.shoeDepthMetres;
  const formationStrengthPa =
    input.surfaceLeakOffPressurePa + hydrostaticAtShoe;
  return {
    formationStrengthPa,
    equivalentMudDensityKgPerCubicMetre:
      formationStrengthPa / (gravity * input.shoeDepthMetres),
    fractureGradientPaPerMetre: formationStrengthPa / input.shoeDepthMetres,
  };
};

export const leakOffTestFormationStrengthExample = {
  input: {
    mudDensityKgPerCubicMetre: 1150,
    shoeDepthMetres: 1800,
    surfaceLeakOffPressurePa: 12000000,
  },
  output: {
    formationStrengthPa: 32299765.5,
    equivalentMudDensityKgPerCubicMetre: 1829.8108086519524,
    fractureGradientPaPerMetre: 17944.314166666667,
  },
} satisfies ToolExample<
  LeakOffTestFormationStrengthInput,
  LeakOffTestFormationStrengthOutput
>;

export const leakOffTestFormationStrengthTool = createSimpleTool({
  id: "geology/leak-off-test-formation-strength",
  title: "Leak Off Test Formation Strength Calculator",
  description:
    "Convert a surface leak-off test pressure into formation strength at the shoe, its fracture gradient and equivalent mud density.",
  inputs: [
    {
      description:
        "Mud density used during the test in kilograms per cubic metre.",
      id: "mudDensityKgPerCubicMetre",
      kind: "number",
      label: "Mud density",
    },
    {
      description: "True vertical depth of the casing shoe in metres.",
      id: "shoeDepthMetres",
      kind: "number",
      label: "Shoe TVD",
    },
    {
      description: "Recorded surface leak-off pressure in pascals.",
      id: "surfaceLeakOffPressurePa",
      kind: "number",
      label: "Surface LOT pressure",
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
      description: "Formation strength at the shoe in pascals.",
      id: "formationStrengthPa",
      kind: "number",
      label: "Formation strength",
    },
    {
      description:
        "Equivalent mud density of the strength in kilograms per cubic metre.",
      id: "equivalentMudDensityKgPerCubicMetre",
      kind: "number",
      label: "Equivalent mud density",
    },
    {
      description: "Fracture pressure gradient in pascals per metre.",
      id: "fractureGradientPaPerMetre",
      kind: "number",
      label: "Fracture gradient",
    },
  ],
  calculate: (input) =>
    calculateLeakOffTestFormationStrength(
      input as unknown as LeakOffTestFormationStrengthInput,
    ),
});

export const runLeakOffTestFormationStrength =
  leakOffTestFormationStrengthTool.execute;
export default leakOffTestFormationStrengthTool;
