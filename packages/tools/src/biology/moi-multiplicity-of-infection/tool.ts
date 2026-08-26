import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type MoiMultiplicityOfInfectionInput = {
  readonly cells: number;
  readonly virusParticles: number;
};

export type MoiMultiplicityOfInfectionOutput = {
  readonly multiplicityOfInfection: number;
};

export const moiMultiplicityOfInfectionExample = {
  input: { cells: 1000000, virusParticles: 5000000 },
  output: { multiplicityOfInfection: 5 },
} satisfies ToolExample<
  MoiMultiplicityOfInfectionInput,
  MoiMultiplicityOfInfectionOutput
>;

export const moiMultiplicityOfInfectionTool = createSimpleTool({
  id: "biology/moi-multiplicity-of-infection",
  title: "MOI Calculator",
  description:
    "Compute the multiplicity of infection as virus particles per target cell.",
  inputs: [
    { id: "cells", label: "Cell count", kind: "integer", minimum: 1 },
    {
      id: "virusParticles",
      label: "Virus particles",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "multiplicityOfInfection",
      label: "Multiplicity of infection",
      kind: "number",
    },
  ],
  calculate: (input) => ({
    multiplicityOfInfection:
      (input.virusParticles as number) / (input.cells as number),
  }),
});
export const runMoiMultiplicityOfInfection =
  moiMultiplicityOfInfectionTool.execute;
export default moiMultiplicityOfInfectionTool;
