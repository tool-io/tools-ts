import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const vaporDensityH2Tool = createSimpleTool({
  id: "chemistry/vapor-density-h2",
  title: "Vapor Density Relative to H2 Calculator",
  description:
    "Compute vapor density relative to hydrogen as the ratio of molar masses M(gas)/M(H₂).",
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
      description: "Density relative to hydrogen gas.",
      id: "vaporDensityH2",
      label: "Vapor density (H₂)",
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
    return { vaporDensityH2: gasMass / 2.016 };
  },
});
export const runVaporDensityH2 = vaporDensityH2Tool.execute;
export default vaporDensityH2Tool;

export type VaporDensityH2Input = {
  readonly gasMolarMassGMol: number;
};

export type VaporDensityH2Output = {
  readonly vaporDensityH2: number;
};

export const vaporDensityH2Example = {
  input: {
    gasMolarMassGMol: 1,
  },
  output: {
    vaporDensityH2: 0.49603174603174605,
  },
} satisfies ToolExample<VaporDensityH2Input, VaporDensityH2Output>;
