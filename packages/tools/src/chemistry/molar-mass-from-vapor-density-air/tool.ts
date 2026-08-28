import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const molarMassFromVaporDensityAirTool = createSimpleTool({
  id: "chemistry/molar-mass-from-vapor-density-air",
  title: "Molar Mass From Vapor Density Air Calculator",
  description:
    "Estimate molar mass from vapor density relative to air using M = 28.96 × VD(air).",
  inputs: [
    {
      description: "Vapor density relative to air.",
      id: "vaporDensityAir",
      label: "Vapor density (air)",
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
    return { molarMassGMol: (input.vaporDensityAir as number) * 28.96 };
  },
});
export const runMolarMassFromVaporDensityAir =
  molarMassFromVaporDensityAirTool.execute;
export default molarMassFromVaporDensityAirTool;

export type MolarMassFromVaporDensityAirInput = {
  readonly vaporDensityAir: number;
};

export type MolarMassFromVaporDensityAirOutput = {
  readonly molarMassGMol: number;
};

export const molarMassFromVaporDensityAirExample = {
  input: {
    vaporDensityAir: 1,
  },
  output: {
    molarMassGMol: 28.96,
  },
} satisfies ToolExample<
  MolarMassFromVaporDensityAirInput,
  MolarMassFromVaporDensityAirOutput
>;
