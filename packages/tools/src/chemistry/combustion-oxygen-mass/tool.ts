import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const combustionOxygenMassTool = createSimpleTool({
  id: "chemistry/combustion-oxygen-mass",
  title: "Combustion Oxygen Mass Calculator",
  description:
    "Compute oxygen in the original sample as the remainder after subtracting carbon and hydrogen masses.",
  inputs: [
    {
      description: "Original sample mass analyzed.",
      id: "sampleMassG",
      label: "Sample mass",
      kind: "number",
      minimum: 0,
      unit: "g",
    },
    {
      description: "Carbon mass found from CO₂.",
      id: "carbonMassG",
      label: "Carbon mass",
      kind: "number",
      minimum: 0,
      unit: "g",
    },
    {
      description: "Hydrogen mass found from H₂O.",
      id: "hydrogenMassG",
      label: "Hydrogen mass",
      kind: "number",
      minimum: 0,
      unit: "g",
    },
  ],
  outputs: [
    {
      description: "Oxygen mass attributable to the original sample.",
      id: "oxygenMassG",
      label: "Oxygen mass",
      kind: "number",
      unit: "g",
    },
  ],
  calculate: (input) => {
    const sample = input.sampleMassG as number;
    const others =
      (input.carbonMassG as number) + (input.hydrogenMassG as number);
    if (others > sample)
      simpleError(
        "sampleMassG",
        "Carbon plus hydrogen cannot exceed the total sample mass.",
        "invalid_masses",
      );
    return { oxygenMassG: sample - others };
  },
});
export const runCombustionOxygenMass = combustionOxygenMassTool.execute;
export default combustionOxygenMassTool;

export type CombustionOxygenMassInput = {
  readonly sampleMassG: number;
  readonly carbonMassG: number;
  readonly hydrogenMassG: number;
};

export type CombustionOxygenMassOutput = {
  readonly oxygenMassG: number;
};

export const combustionOxygenMassExample = {
  input: {
    sampleMassG: 2,
    carbonMassG: 1,
    hydrogenMassG: 1,
  },
  output: {
    oxygenMassG: 0,
  },
} satisfies ToolExample<CombustionOxygenMassInput, CombustionOxygenMassOutput>;
