import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const R_GAS = 8.314462618;

export const heatCapacityCvExample = {
  input: { temperatureK: 298 },
  output: { cvJPerMolK: 20.786156545 },
} satisfies ToolExample<
  { readonly temperatureK: number },
  { readonly cvJPerMolK: number }
>;

export const heatCapacityCvTool = createSimpleTool({
  id: "chemistry/heat-capacity-cv",
  title: "CV For Diatomic Ideal Gas",
  description:
    "Report the molar heat capacity at constant volume for a diatomic ideal gas as five halves of the gas constant.",
  inputs: [
    { id: "temperatureK", label: "Temperature", kind: "number", unit: "K" },
  ],
  outputs: [
    {
      id: "cvJPerMolK",
      label: "Cv",
      kind: "number",
      unit: "J/(mol·K)",
    },
  ],
  calculate: (input) => {
    const temperatureK = input.temperatureK as number;
    if (!(temperatureK > 0))
      simpleError("temperatureK", "Temperature must be positive.");
    return { cvJPerMolK: (5 / 2) * R_GAS };
  },
});
export const runHeatCapacityCv = heatCapacityCvTool.execute;
export default heatCapacityCvTool;
