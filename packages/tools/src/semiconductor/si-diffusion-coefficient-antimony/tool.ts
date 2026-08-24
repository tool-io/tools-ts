import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const BOLTZMANN_EV_PER_K = 8.617333262e-5;

export type SiDiffusionCoefficientAntimonyInput = {
  readonly temperatureKelvin: number;
};

export type SiDiffusionCoefficientAntimonyOutput = {
  readonly diffusivityCm2PerS: number;
};

export const siDiffusionCoefficientAntimonyExample = {
  input: { temperatureKelvin: 1273 },
  output: { diffusivityCm2PerS: 7.588333190382194e-16 },
} satisfies ToolExample<
  SiDiffusionCoefficientAntimonyInput,
  SiDiffusionCoefficientAntimonyOutput
>;

export const siDiffusionCoefficientAntimonyTool = createSimpleTool({
  calculate: (input) => ({
    diffusivityCm2PerS:
      0.214 *
      Math.exp(
        -3.65 / (BOLTZMANN_EV_PER_K * (input.temperatureKelvin as number)),
      ),
  }),
  description:
    "Estimate dilute antimony diffusivity in silicon from temperature with the Arrhenius parameters D0 = 0.214 cm^2/s and Ea = 3.65 eV.",
  id: "semiconductor/si-diffusion-coefficient-antimony",
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
      label: "Antimony diffusivity",
      unit: "cm^2/s",
    },
  ],
  title: "Antimony Diffusion Coefficient",
});
export const runSiDiffusionCoefficientAntimony =
  siDiffusionCoefficientAntimonyTool.execute;
export default siDiffusionCoefficientAntimonyTool;
