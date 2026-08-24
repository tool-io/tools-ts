import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const BOLTZMANN_EV_PER_K = 8.617333262e-5;

export type SiDiffusionCoefficientBoronInput = {
  readonly temperatureKelvin: number;
};

export type SiDiffusionCoefficientBoronOutput = {
  readonly diffusivityCm2PerS: number;
};

export const siDiffusionCoefficientBoronExample = {
  input: { temperatureKelvin: 1373 },
  output: { diffusivityCm2PerS: 1.5150457229801047e-13 },
} satisfies ToolExample<
  SiDiffusionCoefficientBoronInput,
  SiDiffusionCoefficientBoronOutput
>;

export const siDiffusionCoefficientBoronTool = createSimpleTool({
  calculate: (input) => ({
    diffusivityCm2PerS:
      0.76 *
      Math.exp(
        -3.46 / (BOLTZMANN_EV_PER_K * (input.temperatureKelvin as number)),
      ),
  }),
  description:
    "Estimate dilute boron diffusivity in silicon from temperature with the Arrhenius parameters D0 = 0.76 cm^2/s and Ea = 3.46 eV.",
  id: "semiconductor/si-diffusion-coefficient-boron",
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
      label: "Boron diffusivity",
      unit: "cm^2/s",
    },
  ],
  title: "Boron Diffusion Coefficient",
});
export const runSiDiffusionCoefficientBoron =
  siDiffusionCoefficientBoronTool.execute;
export default siDiffusionCoefficientBoronTool;
