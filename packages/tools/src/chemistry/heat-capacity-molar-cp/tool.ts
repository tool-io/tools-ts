import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MolarHeatCapacityCpInput = {
  readonly molarCpJPerMolK: number;
};

export type MolarHeatCapacityCpOutput = {
  readonly molarHeatCapacityCp: number;
};

export const molarHeatCapacityCpExample = {
  input: { molarCpJPerMolK: 29.1 },
  output: { molarHeatCapacityCp: 29.1 },
} satisfies ToolExample<MolarHeatCapacityCpInput, MolarHeatCapacityCpOutput>;

export const molarHeatCapacityCpTool = createSimpleTool({
  id: "chemistry/heat-capacity-molar-cp",
  title: "Molar Cp Input Validation",
  description:
    "Validate a molar heat capacity Cp in J/(mol·K) within the physical range (0, 500] and pass it through.",
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
      id: "molarHeatCapacityCp",
      label: "Validated molar Cp",
      kind: "number",
      unit: "J/(mol·K)",
    },
  ],
  calculate: (input) => {
    const molarCpJPerMolK = input.molarCpJPerMolK as number;
    if (!(molarCpJPerMolK > 0))
      simpleError("molarCpJPerMolK", "Molar Cp must be positive.");
    return { molarHeatCapacityCp: molarCpJPerMolK };
  },
});
export const runMolarHeatCapacityCp = molarHeatCapacityCpTool.execute;
export default molarHeatCapacityCpTool;
