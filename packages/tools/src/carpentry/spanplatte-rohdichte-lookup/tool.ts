import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ParticleBoardDensityInput = {
  readonly boardThicknessMm: number;
};

export type ParticleBoardDensityOutput = {
  readonly nominalDensityKgPerCbm: number;
};

export const particleBoardDensityExample = {
  input: { boardThicknessMm: 19 },
  output: { nominalDensityKgPerCbm: 650 },
} satisfies ToolExample<ParticleBoardDensityInput, ParticleBoardDensityOutput>;

export const particleBoardDensityTool = createSimpleTool({
  id: "carpentry/spanplatte-rohdichte-lookup",
  title: "Particle Board Density Lookup",
  description:
    "Classify a particle board by thickness and return its nominal raw density in kilograms per cubic meter.",
  inputs: [
    {
      description: "Nominal thickness of the particle board.",
      id: "boardThicknessMm",
      kind: "number",
      label: "Board thickness",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Nominal raw density class of the board.",
      id: "nominalDensityKgPerCbm",
      kind: "number",
      label: "Nominal density",
      unit: "kg/m³",
    },
  ],
  calculate: (input) => {
    const boardThicknessMm = input.boardThicknessMm as number;
    if (!(boardThicknessMm > 0))
      simpleError(
        "boardThicknessMm",
        "Board thickness must be positive.",
        "must_be_positive",
      );
    return {
      nominalDensityKgPerCbm:
        boardThicknessMm <= 13 ? 700 : boardThicknessMm <= 25 ? 650 : 600,
    };
  },
});
export const runParticleBoardDensity = particleBoardDensityTool.execute;
export default particleBoardDensityTool;
