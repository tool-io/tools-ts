import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThermalDiffusivityInput = Readonly<{
  readonly conductivityWattsPerMeterKelvin: number;
  readonly densityKgPerM3: number;
  readonly specificJoulesPerKgKelvin: number;
}>;
export type ThermalDiffusivityOutput = Readonly<{
  readonly diffusivitySquareMetersPerSecond: number;
}>;

export const calculateThermalDiffusivity = (
  x: ThermalDiffusivityInput,
): ThermalDiffusivityOutput => {
  if (
    !Number.isFinite(x.conductivityWattsPerMeterKelvin) ||
    x.conductivityWattsPerMeterKelvin < 0
  )
    simpleError(
      "conductivityWattsPerMeterKelvin",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.densityKgPerM3) || x.densityKgPerM3 < 0)
    simpleError("densityKgPerM3", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.specificJoulesPerKgKelvin) ||
    x.specificJoulesPerKgKelvin < 0
  )
    simpleError(
      "specificJoulesPerKgKelvin",
      "Provide a finite number at least 0.",
    );
  const diffusivitySquareMetersPerSecond =
    x.conductivityWattsPerMeterKelvin /
    (x.densityKgPerM3 * x.specificJoulesPerKgKelvin);
  if (!Number.isFinite(diffusivitySquareMetersPerSecond))
    simpleError(
      "diffusivitySquareMetersPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    diffusivitySquareMetersPerSecond: Object.is(
      diffusivitySquareMetersPerSecond,
      -0,
    )
      ? 0
      : diffusivitySquareMetersPerSecond,
  };
};

export const example = {
  input: {
    conductivityWattsPerMeterKelvin: 1,
    densityKgPerM3: 1000,
    specificJoulesPerKgKelvin: 1000,
  },
  output: { diffusivitySquareMetersPerSecond: 0.000001 },
} satisfies ToolExample<ThermalDiffusivityInput, ThermalDiffusivityOutput>;

export const tool = createSimpleTool({
  id: "engineering/thermal-diffusivity",
  title: "Thermal Diffusivity",
  description:
    "Thermal diffusivity α=k/(ρcp) from conductivity, density and specific heat in coherent SI units.",
  inputs: [
    {
      id: "conductivityWattsPerMeterKelvin",
      kind: "number",
      label: "Conductivity Watts Per Meter Kelvin",
      unit: "W/(m·K)",
      minimum: 0,
    },
    {
      id: "densityKgPerM3",
      kind: "number",
      label: "Density Kg Per M3",
      unit: "kg/m³",
      minimum: 0,
    },
    {
      id: "specificJoulesPerKgKelvin",
      kind: "number",
      label: "Specific Joules Per Kg Kelvin",
      unit: "J/(kg·K)",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "diffusivitySquareMetersPerSecond",
      kind: "number",
      label: "Diffusivity Square Meters Per Second",
      unit: "m²/s",
    },
  ],
  calculate: (input) =>
    calculateThermalDiffusivity({
      conductivityWattsPerMeterKelvin:
        input.conductivityWattsPerMeterKelvin as number,
      densityKgPerM3: input.densityKgPerM3 as number,
      specificJoulesPerKgKelvin: input.specificJoulesPerKgKelvin as number,
    }),
});
export const thermalDiffusivityTool = tool;
export const runThermalDiffusivity = tool.execute;
export default tool;
