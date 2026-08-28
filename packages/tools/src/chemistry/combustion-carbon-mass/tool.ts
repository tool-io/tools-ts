import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const combustionCarbonMassTool = createSimpleTool({
  id: "chemistry/combustion-carbon-mass",
  title: "Combustion Carbon Mass Calculator",
  description:
    "Compute the carbon contained in a burned sample from the CO₂ collected during combustion analysis.",
  inputs: [
    {
      description: "Mass of carbon dioxide captured by the absorber.",
      id: "co2MassG",
      label: "CO₂ mass",
      kind: "number",
      minimum: 0,
      unit: "g",
    },
  ],
  outputs: [
    {
      description: "Carbon mass attributable to the original sample.",
      id: "carbonMassG",
      label: "Carbon mass",
      kind: "number",
      unit: "g",
    },
  ],
  calculate: (input) => {
    return {
      carbonMassG: ((input.co2MassG as number) * 12.011) / 44.0095,
    };
  },
});
export const runCombustionCarbonMass = combustionCarbonMassTool.execute;
export default combustionCarbonMassTool;

export type CombustionCarbonMassInput = {
  readonly co2MassG: number;
};

export type CombustionCarbonMassOutput = {
  readonly carbonMassG: number;
};

export const combustionCarbonMassExample = {
  input: {
    co2MassG: 1,
  },
  output: {
    carbonMassG: 0.2729183471750417,
  },
} satisfies ToolExample<CombustionCarbonMassInput, CombustionCarbonMassOutput>;
