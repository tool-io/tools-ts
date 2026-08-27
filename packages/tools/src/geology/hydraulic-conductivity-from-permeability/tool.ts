import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HydraulicConductivityFromPermeabilityInput = {
  readonly intrinsicPermeabilityM2: number;
  readonly fluidDensityKgM3?: number;
  readonly gravityMS2?: number;
  readonly dynamicViscosityPaS?: number;
};

export type HydraulicConductivityFromPermeabilityOutput = {
  readonly hydraulicConductivityMS: number;
};

export const calculateHydraulicConductivityFromPermeability = (
  input: HydraulicConductivityFromPermeabilityInput,
): HydraulicConductivityFromPermeabilityOutput => {
  const density = input.fluidDensityKgM3 ?? 1000;
  const gravity = input.gravityMS2 ?? 9.80665;
  const viscosity = input.dynamicViscosityPaS ?? 0.001;
  if (!(input.intrinsicPermeabilityM2 > 0))
    simpleError(
      "intrinsicPermeabilityM2",
      "Intrinsic permeability must be greater than zero.",
      "invalid_permeability",
    );
  if (!(density > 0))
    simpleError(
      "fluidDensityKgM3",
      "Fluid density must be positive.",
      "invalid_density",
    );
  if (!(gravity > 0))
    simpleError("gravityMS2", "Gravity must be positive.", "invalid_gravity");
  if (!(viscosity > 0))
    simpleError(
      "dynamicViscosityPaS",
      "Dynamic viscosity must be positive.",
      "invalid_viscosity",
    );
  return {
    hydraulicConductivityMS:
      (input.intrinsicPermeabilityM2 * density * gravity) / viscosity,
  };
};

export const hydraulicConductivityFromPermeabilityExample = {
  input: { intrinsicPermeabilityM2: 1e-11 },
  output: { hydraulicConductivityMS: 9.80665e-5 },
} satisfies ToolExample<
  HydraulicConductivityFromPermeabilityInput,
  HydraulicConductivityFromPermeabilityOutput
>;

export const hydraulicConductivityFromPermeabilityTool = createSimpleTool({
  id: "geology/hydraulic-conductivity-from-permeability",
  title: "Hydraulic Conductivity From Permeability Calculator",
  description:
    "Convert intrinsic permeability in square meters to hydraulic conductivity in meters per second via K = k * rho * g / mu (defaults for water at 20 degrees Celsius).",
  inputs: [
    {
      description: "Intrinsic permeability of the medium in square meters.",
      id: "intrinsicPermeabilityM2",
      kind: "number",
      label: "k",
    },
    {
      default: 1000,
      description: "Fluid density in kilograms per cubic meter.",
      id: "fluidDensityKgM3",
      kind: "number",
      label: "Density",
    },
    {
      default: 9.80665,
      description: "Gravitational acceleration in meters per second squared.",
      id: "gravityMS2",
      kind: "number",
      label: "Gravity",
    },
    {
      default: 0.001,
      description: "Dynamic viscosity in pascal seconds.",
      id: "dynamicViscosityPaS",
      kind: "number",
      label: "Viscosity",
    },
  ],
  outputs: [
    {
      description: "Hydraulic conductivity in meters per second.",
      id: "hydraulicConductivityMS",
      kind: "number",
      label: "K",
    },
  ],
  calculate: (input) =>
    calculateHydraulicConductivityFromPermeability(
      input as unknown as HydraulicConductivityFromPermeabilityInput,
    ),
});

export const runHydraulicConductivityFromPermeability =
  hydraulicConductivityFromPermeabilityTool.execute;
export default hydraulicConductivityFromPermeabilityTool;
