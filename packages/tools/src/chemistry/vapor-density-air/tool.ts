import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const vaporDensityAirTool = createSimpleTool({
  id: "chemistry/vapor-density-air",
  title: "Vapor Density Relative to Air Calculator",
  description:
    "Compute vapor density relative to air as the ratio of molar masses M(gas)/28.96.",
  inputs: [
    {
      description: "Molar mass of the gas; must be greater than zero.",
      id: "gasMolarMassGMol",
      label: "Gas molar mass",
      kind: "number",
      unit: "g/mol",
    },
  ],
  outputs: [
    {
      description:
        "Density relative to air; values below one are lighter than air.",
      id: "vaporDensityAir",
      label: "Vapor density (air)",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const gasMass = input.gasMolarMassGMol as number;
    if (gasMass <= 0)
      simpleError(
        "gasMolarMassGMol",
        "The gas molar mass must be greater than zero.",
        "invalid_molar_mass",
      );
    return { vaporDensityAir: gasMass / 28.96 };
  },
});
export const runVaporDensityAir = vaporDensityAirTool.execute;
export default vaporDensityAirTool;

export type VaporDensityAirInput = {
  readonly gasMolarMassGMol: number;
};

export type VaporDensityAirOutput = {
  readonly vaporDensityAir: number;
};

export const vaporDensityAirExample = {
  input: {
    gasMolarMassGMol: 1,
  },
  output: {
    vaporDensityAir: 0.034530386740331494,
  },
} satisfies ToolExample<VaporDensityAirInput, VaporDensityAirOutput>;
