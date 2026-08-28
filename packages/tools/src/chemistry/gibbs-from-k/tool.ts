import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const R_GAS = 8.314462618;

export const gibbsFromKExample = {
  input: { equilibriumConstantK: 10, temperatureK: 298.15 },
} satisfies ToolExample<{
  readonly equilibriumConstantK: number;
  readonly temperatureK: number;
}>;

export const gibbsFromKTool = createSimpleTool({
  id: "chemistry/gibbs-from-k",
  title: "Delta G From K",
  description:
    "Compute Gibbs free energy change in kJ per mole from the equilibrium constant as -R times T times ln(K).",
  inputs: [
    {
      id: "equilibriumConstantK",
      label: "Equilibrium constant K",
      kind: "number",
    },
    { id: "temperatureK", label: "Temperature", kind: "number", unit: "K" },
  ],
  outputs: [
    {
      id: "gibbsFreeEnergyKJ",
      label: "Gibbs free energy",
      kind: "number",
      unit: "kJ/mol",
    },
  ],
  calculate: (input) => {
    const equilibriumConstantK = input.equilibriumConstantK as number;
    const temperatureK = input.temperatureK as number;
    if (!(equilibriumConstantK > 0))
      simpleError(
        "equilibriumConstantK",
        "Equilibrium constant must be positive.",
      );
    if (!(temperatureK > 0))
      simpleError("temperatureK", "Temperature must be positive.");
    return {
      gibbsFreeEnergyKJ:
        (-R_GAS * temperatureK * Math.log(equilibriumConstantK)) / 1000,
    };
  },
});
export const runGibbsFromK = gibbsFromKTool.execute;
export default gibbsFromKTool;
