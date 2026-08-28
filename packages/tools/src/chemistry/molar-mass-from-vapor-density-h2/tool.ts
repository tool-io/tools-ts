import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const molarMassFromVaporDensityH2Tool = createSimpleTool({
  id: "chemistry/molar-mass-from-vapor-density-h2",
  title: "Molar Mass From Vapor Density H2 Calculator",
  description:
    "Estimate molar mass from vapor density relative to hydrogen gas using M = 2.016 × VD(H₂).",
  inputs: [
    {
      description: "Vapor density relative to hydrogen gas.",
      id: "vaporDensityH2",
      label: "Vapor density (H₂)",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Estimated molar mass in grams per mole.",
      id: "molarMassGMol",
      label: "Molar mass",
      kind: "number",
      unit: "g/mol",
    },
  ],
  calculate: (input) => {
    return { molarMassGMol: (input.vaporDensityH2 as number) * 2.016 };
  },
});
export const runMolarMassFromVaporDensityH2 =
  molarMassFromVaporDensityH2Tool.execute;
export default molarMassFromVaporDensityH2Tool;

export type MolarMassFromVaporDensityH2Input = {
  readonly vaporDensityH2: number;
};

export type MolarMassFromVaporDensityH2Output = {
  readonly molarMassGMol: number;
};

export const molarMassFromVaporDensityH2Example = {
  input: {
    vaporDensityH2: 1,
  },
  output: {
    molarMassGMol: 2.016,
  },
} satisfies ToolExample<
  MolarMassFromVaporDensityH2Input,
  MolarMassFromVaporDensityH2Output
>;
