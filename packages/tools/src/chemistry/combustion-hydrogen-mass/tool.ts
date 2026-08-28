import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const combustionHydrogenMassTool = createSimpleTool({
  id: "chemistry/combustion-hydrogen-mass",
  title: "Combustion Hydrogen Mass Calculator",
  description:
    "Compute the hydrogen contained in a burned sample from the H₂O collected during combustion analysis.",
  inputs: [
    {
      description: "Mass of water captured by the absorber.",
      id: "h2oMassG",
      label: "H₂O mass",
      kind: "number",
      minimum: 0,
      unit: "g",
    },
  ],
  outputs: [
    {
      description: "Hydrogen mass attributable to the original sample.",
      id: "hydrogenMassG",
      label: "Hydrogen mass",
      kind: "number",
      unit: "g",
    },
  ],
  calculate: (input) => {
    return {
      hydrogenMassG: ((input.h2oMassG as number) * 2.01588) / 18.01528,
    };
  },
});
export const runCombustionHydrogenMass = combustionHydrogenMassTool.execute;
export default combustionHydrogenMassTool;

export type CombustionHydrogenMassInput = {
  readonly h2oMassG: number;
};

export type CombustionHydrogenMassOutput = {
  readonly hydrogenMassG: number;
};

export const combustionHydrogenMassExample = {
  input: {
    h2oMassG: 1,
  },
  output: {
    hydrogenMassG: 0.11189834407236524,
  },
} satisfies ToolExample<
  CombustionHydrogenMassInput,
  CombustionHydrogenMassOutput
>;
