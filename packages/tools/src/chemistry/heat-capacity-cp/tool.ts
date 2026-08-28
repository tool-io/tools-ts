import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const R_GAS = 8.314462618;

export const heatCapacityCpExample = {
  input: { temperatureK: 300 },
  output: { cpMinusCvJPerMolK: 8.314462618 },
} satisfies ToolExample<
  { readonly temperatureK: number },
  { readonly cpMinusCvJPerMolK: number }
>;

export const heatCapacityCpTool = createSimpleTool({
  id: "chemistry/heat-capacity-cp",
  title: "CP Minus CV",
  description:
    "Report the Mayer relation for an ideal gas as the difference between molar heat capacities at constant pressure and constant volume.",
  inputs: [
    { id: "temperatureK", label: "Temperature", kind: "number", unit: "K" },
  ],
  outputs: [
    {
      id: "cpMinusCvJPerMolK",
      label: "Cp minus Cv",
      kind: "number",
      unit: "J/(mol·K)",
    },
  ],
  calculate: (input) => {
    const temperatureK = input.temperatureK as number;
    if (!(temperatureK > 0))
      simpleError("temperatureK", "Temperature must be positive.");
    return { cpMinusCvJPerMolK: R_GAS };
  },
});
export const runHeatCapacityCp = heatCapacityCpTool.execute;
export default heatCapacityCpTool;
