import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const R_GAS = 8.314462618;

export const averageSpeedGasExample = {
  input: { molarMassKgPerMol: 0.032, temperatureK: 300 },
} satisfies ToolExample<{
  readonly molarMassKgPerMol: number;
  readonly temperatureK: number;
}>;

export const averageSpeedGasTool = createSimpleTool({
  id: "chemistry/average-speed-gas",
  title: "Average Speed Gas",
  description:
    "Compute the Maxwell-Boltzmann mean molecular speed of a gas from temperature and molar mass.",
  inputs: [
    { id: "temperatureK", label: "Temperature", kind: "number", unit: "K" },
    {
      id: "molarMassKgPerMol",
      label: "Molar mass",
      kind: "number",
      unit: "kg/mol",
    },
  ],
  outputs: [
    {
      id: "averageSpeedMetersPerSecond",
      label: "Average speed",
      kind: "number",
      unit: "m/s",
    },
  ],
  calculate: (input) => {
    const temperatureK = input.temperatureK as number;
    const molarMassKgPerMol = input.molarMassKgPerMol as number;
    if (!(temperatureK > 0))
      simpleError("temperatureK", "Temperature must be positive.");
    if (!(molarMassKgPerMol > 0))
      simpleError("molarMassKgPerMol", "Molar mass must be positive.");
    return {
      averageSpeedMetersPerSecond: Math.sqrt(
        (8 * R_GAS * temperatureK) / (Math.PI * molarMassKgPerMol),
      ),
    };
  },
});
export const runAverageSpeedGas = averageSpeedGasTool.execute;
export default averageSpeedGasTool;
