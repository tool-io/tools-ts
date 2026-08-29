import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    repulsionAmplitudeJ: 1e-19,
    inverseDebyeLengthPerM: 100000000,
    separationM: 1e-8,
    hamakerConstantJ: 1e-20,
    particleRadiusM: 1e-7,
  },
  output: { interactionEnergyJ: 2.0121277450477568e-20 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "chemistry/colloid-stability-dlvo",
  title: "DLVO Interaction Energy Estimate",
  description:
    "Combine a user-specified exponentially screened electrostatic repulsion with the non-retarded sphere–plate van der Waals term −AR/(6h). This is a simplified DLVO energy model, not a stability verdict for arbitrary colloids.",
  inputs: [
    {
      id: "repulsionAmplitudeJ",
      kind: "number",
      label: "Repulsion amplitude (J)",
      minimum: 0,
    },
    {
      id: "inverseDebyeLengthPerM",
      kind: "number",
      label: "Inverse Debye length (1/m)",
      minimum: 0,
    },
    {
      id: "separationM",
      kind: "number",
      label: "Surface separation (m)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "hamakerConstantJ",
      kind: "number",
      label: "Hamaker constant (J)",
      minimum: 0,
    },
    {
      id: "particleRadiusM",
      kind: "number",
      label: "Particle radius (m)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "interactionEnergyJ",
      kind: "number",
      label: "Interaction energy (J)",
    },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      interactionEnergyJ:
        i.repulsionAmplitudeJ *
          Math.exp(-i.inverseDebyeLengthPerM * i.separationM) -
        (i.hamakerConstantJ * i.particleRadiusM) / (6 * i.separationM),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type ColloidStabilityDlvoInput = Readonly<typeof example.input>;
export type ColloidStabilityDlvoOutput = Readonly<typeof example.output>;
export const colloidStabilityDlvoTool = tool;
export const runColloidStabilityDlvo = tool.execute;
export default tool;
