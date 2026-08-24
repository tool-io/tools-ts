import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const BOLTZMANN_EV_PER_K = 8.617333262e-5;

export type SiDiffusionCoefficientPhosphorusInput = {
  readonly temperatureKelvin: number;
};

export type SiDiffusionCoefficientPhosphorusOutput = {
  readonly diffusivityCm2PerS: number;
};

export const siDiffusionCoefficientPhosphorusExample = {
  input: { temperatureKelvin: 1273 },
  output: { diffusivityCm2PerS: 1.2462454170747153e-14 },
} satisfies ToolExample<
  SiDiffusionCoefficientPhosphorusInput,
  SiDiffusionCoefficientPhosphorusOutput
>;

export const siDiffusionCoefficientPhosphorusTool = createSimpleTool({
  calculate: (input) => ({
    diffusivityCm2PerS:
      3.85 *
      Math.exp(
        -3.66 / (BOLTZMANN_EV_PER_K * (input.temperatureKelvin as number)),
      ),
  }),
  description:
    "Estimate dilute phosphorus diffusivity in silicon from temperature with the Arrhenius parameters D0 = 3.85 cm^2/s and Ea = 3.66 eV.",
  id: "semiconductor/si-diffusion-coefficient-phosphorus",
  inputs: [
    {
      id: "temperatureKelvin",
      kind: "number",
      label: "Temperature",
      maximum: 1600,
      minimum: 800,
      unit: "K",
    },
  ],
  outputs: [
    {
      id: "diffusivityCm2PerS",
      kind: "number",
      label: "Phosphorus diffusivity",
      unit: "cm^2/s",
    },
  ],
  title: "Phosphorus Diffusion Coefficient",
});
export const runSiDiffusionCoefficientPhosphorus =
  siDiffusionCoefficientPhosphorusTool.execute;
export default siDiffusionCoefficientPhosphorusTool;
