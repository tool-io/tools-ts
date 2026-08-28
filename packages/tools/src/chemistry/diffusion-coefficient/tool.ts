import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const diffusionCoefficientTool = createSimpleTool({
  id: "chemistry/diffusion-coefficient",
  title: "Diffusion Coefficient Calculator",
  description:
    "Compute the diffusion coefficient from mean squared displacement via D = ⟨x²⟩/(2·d·t).",
  inputs: [
    {
      description: "Mean squared displacement in cm².",
      id: "meanSquaredDisplacementCm2",
      label: "Mean squared displacement",
      kind: "number",
      minimum: 0,
      unit: "cm²",
    },
    {
      description: "Elapsed diffusion time; must be greater than zero.",
      id: "timeSeconds",
      label: "Time",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      default: 3,
      description: "Dimensionality of diffusion (1, 2, or 3).",
      id: "dimensions",
      label: "Dimensions",
      kind: "integer",
      maximum: 3,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Diffusion coefficient in cm²/s.",
      id: "diffusionCoefficientCm2S",
      label: "Diffusion coefficient",
      kind: "number",
      unit: "cm²/s",
    },
  ],
  calculate: (input) => {
    const time = input.timeSeconds as number;
    if (time <= 0)
      simpleError(
        "timeSeconds",
        "The time must be greater than zero seconds.",
        "invalid_time",
      );
    const dimensions = (input.dimensions ?? 3) as number;
    return {
      diffusionCoefficientCm2S:
        (input.meanSquaredDisplacementCm2 as number) / (2 * dimensions * time),
    };
  },
});
export const runDiffusionCoefficient = diffusionCoefficientTool.execute;
export default diffusionCoefficientTool;

export type DiffusionCoefficientInput = {
  readonly meanSquaredDisplacementCm2: number;
  readonly timeSeconds: number;
  readonly dimensions: number;
};

export type DiffusionCoefficientOutput = {
  readonly diffusionCoefficientCm2S: number;
};

export const diffusionCoefficientExample = {
  input: {
    meanSquaredDisplacementCm2: 1,
    timeSeconds: 1,
    dimensions: 3,
  },
  output: {
    diffusionCoefficientCm2S: 0.16666666666666666,
  },
} satisfies ToolExample<DiffusionCoefficientInput, DiffusionCoefficientOutput>;
