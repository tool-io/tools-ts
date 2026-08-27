import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeliumDiffusionClosureTemperatureInput = {
  readonly activationEnergyKJPerMol?: number;
  readonly diffusionAnisotropyA?: number;
  readonly coolingRateKPerMillionYears?: number;
};

export type HeliumDiffusionClosureTemperatureOutput = {
  readonly closureTemperatureC: number;
  readonly coolingRateKPerSecond: number;
};

const R_J_PER_MOL_K = 8.314462618;
const SECONDS_PER_MILLION_YEARS = 1e6 * 365.25 * 24 * 60 * 60;

/**
 * Dodson (1973): T = E / (R ln(A R T^2 / (E dT/dt))), solved by
 * fixed-point iteration.
 */
const solveClosureTemperature = (
  energyJPerMol: number,
  anisotropyA: number,
  rateKPerSecond: number,
): number => {
  let tKelvin = energyJPerMol / (R_J_PER_MOL_K * 30);
  for (let iteration = 0; iteration < 300; iteration += 1) {
    const next =
      energyJPerMol /
      (R_J_PER_MOL_K *
        Math.log(
          (anisotropyA * R_J_PER_MOL_K * tKelvin ** 2) /
            (energyJPerMol * rateKPerSecond),
        ));
    if (!Number.isFinite(next))
      simpleError(
        "coolingRateKPerMillionYears",
        "No finite closure temperature for these kinetics.",
        "invalid_kinetics",
      );
    if (Math.abs(next - tKelvin) < 1e-12) return next;
    tKelvin = next;
  }
  return tKelvin;
};

export const calculateHeliumDiffusionClosureTemperature = (
  input: HeliumDiffusionClosureTemperatureInput,
): HeliumDiffusionClosureTemperatureOutput => {
  const energyKJPerMol = input.activationEnergyKJPerMol ?? 140;
  const anisotropyA = input.diffusionAnisotropyA ?? 25;
  const rateKPerMy = input.coolingRateKPerMillionYears ?? 10;
  if (!(energyKJPerMol > 0))
    simpleError(
      "activationEnergyKJPerMol",
      "Activation energy must be positive.",
      "invalid_kinetics",
    );
  if (!(anisotropyA > 0))
    simpleError(
      "diffusionAnisotropyA",
      "Anisotropy factor must be positive.",
      "invalid_kinetics",
    );
  if (!(rateKPerMy > 0))
    simpleError(
      "coolingRateKPerMillionYears",
      "Cooling rate must be positive.",
      "invalid_kinetics",
    );
  const coolingRateKPerSecond = rateKPerMy / SECONDS_PER_MILLION_YEARS;
  return {
    closureTemperatureC:
      solveClosureTemperature(
        energyKJPerMol * 1000,
        anisotropyA,
        coolingRateKPerSecond,
      ) - 273.15,
    coolingRateKPerSecond,
  };
};

export const heliumDiffusionClosureTemperatureExample = {
  input: {
    activationEnergyKJPerMol: 140,
    diffusionAnisotropyA: 25,
    coolingRateKPerMillionYears: 10,
  },
  output: {
    closureTemperatureC: 212.93243753028753,
    coolingRateKPerSecond: 10 / SECONDS_PER_MILLION_YEARS,
  },
} satisfies ToolExample<
  HeliumDiffusionClosureTemperatureInput,
  HeliumDiffusionClosureTemperatureOutput
>;

export const heliumDiffusionClosureTemperatureTool = createSimpleTool({
  id: "geology/helium-diffusion-closure-temperature",
  title: "Helium Diffusion Closure Temperature Calculator",
  description:
    "Solve the Dodson (1973) closure temperature for helium diffusion given activation energy, diffusion anisotropy and cooling rate.",
  inputs: [
    {
      default: 140,
      description: "Diffusion activation energy in kJ/mol.",
      id: "activationEnergyKJPerMol",
      kind: "number",
      label: "Activation energy",
    },
    {
      default: 25,
      description: "Dodson geometry/diffusion anisotropy factor A.",
      id: "diffusionAnisotropyA",
      kind: "number",
      label: "Anisotropy A",
    },
    {
      default: 10,
      description: "Cooling rate in kelvin per million years.",
      id: "coolingRateKPerMillionYears",
      kind: "number",
      label: "Cooling rate",
    },
  ],
  outputs: [
    {
      description: "Closure temperature in degrees Celsius.",
      id: "closureTemperatureC",
      kind: "number",
      label: "Closure T",
    },
    {
      description: "Cooling rate converted to kelvin per second.",
      id: "coolingRateKPerSecond",
      kind: "number",
      label: "Cooling rate",
    },
  ],
  calculate: (input) =>
    calculateHeliumDiffusionClosureTemperature(
      input as unknown as HeliumDiffusionClosureTemperatureInput,
    ),
});

export const runHeliumDiffusionClosureTemperature =
  heliumDiffusionClosureTemperatureTool.execute;
export default heliumDiffusionClosureTemperatureTool;
