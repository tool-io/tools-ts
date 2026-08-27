import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ArgonDiffusionClosureTemperatureInput = {
  readonly activationEnergyKJPerMol?: number;
  readonly diffusionAnisotropyA?: number;
  readonly coolingRateKPerMillionYears?: number;
};

export type ArgonDiffusionClosureTemperatureOutput = {
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

export const calculateArgonDiffusionClosureTemperature = (
  input: ArgonDiffusionClosureTemperatureInput,
): ArgonDiffusionClosureTemperatureOutput => {
  const energyKJPerMol = input.activationEnergyKJPerMol ?? 200;
  const anisotropyA = input.diffusionAnisotropyA ?? 25;
  const rateKPerMy = input.coolingRateKPerMillionYears ?? 100;
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

export const argonDiffusionClosureTemperatureExample = {
  input: {
    activationEnergyKJPerMol: 200,
    diffusionAnisotropyA: 25,
    coolingRateKPerMillionYears: 100,
  },
  output: {
    closureTemperatureC: 460.1387823697314,
    coolingRateKPerSecond: 100 / SECONDS_PER_MILLION_YEARS,
  },
} satisfies ToolExample<
  ArgonDiffusionClosureTemperatureInput,
  ArgonDiffusionClosureTemperatureOutput
>;

export const argonDiffusionClosureTemperatureTool = createSimpleTool({
  id: "geology/argon-diffusion-closure-temperature",
  title: "Argon Diffusion Closure Temperature Calculator",
  description:
    "Solve the Dodson (1973) closure temperature for argon diffusion given activation energy, diffusion anisotropy and cooling rate.",
  inputs: [
    {
      default: 200,
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
    calculateArgonDiffusionClosureTemperature(
      input as unknown as ArgonDiffusionClosureTemperatureInput,
    ),
});

export const runArgonDiffusionClosureTemperature =
  argonDiffusionClosureTemperatureTool.execute;
export default argonDiffusionClosureTemperatureTool;
