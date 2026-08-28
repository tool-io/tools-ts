import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MolarHeatCapacityCvInput = {
  readonly molarCpJPerMolK: number;
};

export type MolarHeatCapacityCvOutput = {
  readonly molarHeatCapacityCv: number;
};

export const molarHeatCapacityCvExample = {
  input: { molarCpJPerMolK: 29.114462618 },
  output: { molarHeatCapacityCv: 20.8 },
} satisfies ToolExample<MolarHeatCapacityCvInput, MolarHeatCapacityCvOutput>;

const gasConstantJPerMolK = 8.314462618;

export const molarHeatCapacityCvTool = createSimpleTool({
  id: "chemistry/heat-capacity-molar-cv",
  title: "Molar Cv From Cp",
  description:
    "Compute the molar heat capacity at constant volume from Cp using the ideal gas relation Cv = Cp − R.",
  inputs: [
    {
      id: "molarCpJPerMolK",
      label: "Molar heat capacity Cp",
      kind: "number",
      unit: "J/(mol·K)",
    },
  ],
  outputs: [
    {
      id: "molarHeatCapacityCv",
      label: "Molar heat capacity Cv",
      kind: "number",
      unit: "J/(mol·K)",
    },
  ],
  calculate: (input) => {
    const molarCpJPerMolK = input.molarCpJPerMolK as number;
    if (!(molarCpJPerMolK > gasConstantJPerMolK))
      simpleError(
        "molarCpJPerMolK",
        "Molar Cp must exceed the gas constant.",
        "below_gas_minimum",
      );
    return {
      molarHeatCapacityCv: molarCpJPerMolK - gasConstantJPerMolK,
    };
  },
});
export const runMolarHeatCapacityCv = molarHeatCapacityCvTool.execute;
export default molarHeatCapacityCvTool;
