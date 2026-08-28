import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NumberOfParticlesInput = {
  readonly moles: number;
};

export type NumberOfParticlesOutput = {
  readonly particleCount: number;
};

export const numberOfParticlesExample = {
  input: { moles: 2 },
  output: { particleCount: 2 * 6.02214076e23 },
} satisfies ToolExample<NumberOfParticlesInput, NumberOfParticlesOutput>;

export const AVOGADRO = 6.02214076e23;

export const numberOfParticlesTool = createSimpleTool({
  id: "chemistry/number-of-particles",
  title: "Particle Count Calculator",
  description:
    "Compute the number of particles from an amount of substance using Avogadro's constant.",
  inputs: [
    {
      description: "Amount of substance.",
      id: "moles",
      kind: "number",
      label: "Moles",
      unit: "mol",
    },
  ],
  outputs: [
    {
      description: "Number of individual particles.",
      id: "particleCount",
      kind: "number",
      label: "Particle count",
    },
  ],
  calculate: (input) => {
    const moles = input.moles as number;
    if (moles < 0)
      simpleError("moles", "The amount of substance cannot be negative.");
    return { particleCount: moles * AVOGADRO };
  },
});
export const runNumberOfParticles = numberOfParticlesTool.execute;
export default numberOfParticlesTool;
