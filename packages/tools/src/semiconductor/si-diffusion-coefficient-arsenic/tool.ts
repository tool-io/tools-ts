import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const BOLTZMANN_EV_PER_K = 8.617333262e-5;

export type SiDiffusionCoefficientArsenicInput = {
  readonly temperatureKelvin: number;
};

export type SiDiffusionCoefficientArsenicOutput = {
  readonly diffusivityCm2PerS: number;
};

export const siDiffusionCoefficientArsenicExample = {
  input: { temperatureKelvin: 1273 },
  output: { diffusivityCm2PerS: 1.3487164056197636e-15 },
} satisfies ToolExample<
  SiDiffusionCoefficientArsenicInput,
  SiDiffusionCoefficientArsenicOutput
>;

export const siDiffusionCoefficientArsenicTool = createSimpleTool({
  calculate: (input) => ({
    diffusivityCm2PerS:
      23 *
      Math.exp(
        -4.1 / (BOLTZMANN_EV_PER_K * (input.temperatureKelvin as number)),
      ),
  }),
  description:
    "Estimate dilute arsenic diffusivity in silicon from temperature with the Arrhenius parameters D0 = 23 cm^2/s and Ea = 4.1 eV.",
  id: "semiconductor/si-diffusion-coefficient-arsenic",
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
      label: "Arsenic diffusivity",
      unit: "cm^2/s",
    },
  ],
  title: "Arsenic Diffusion Coefficient",
});
export const runSiDiffusionCoefficientArsenic =
  siDiffusionCoefficientArsenicTool.execute;
export default siDiffusionCoefficientArsenicTool;
