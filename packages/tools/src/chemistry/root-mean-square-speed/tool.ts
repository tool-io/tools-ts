import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const R_GAS = 8.314462618;

export const rootMeanSquareSpeedExample = {
  input: { molarMassKgPerMol: 0.032, temperatureK: 300 },
} satisfies ToolExample<{
  readonly molarMassKgPerMol: number;
  readonly temperatureK: number;
}>;

export const rootMeanSquareSpeedTool = createSimpleTool({
  id: "chemistry/root-mean-square-speed",
  title: "RMS Speed Calculator",
  description:
    "Compute the root-mean-square speed of gas molecules from temperature and molar mass.",
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
      id: "rmsSpeedMetersPerSecond",
      label: "Root-mean-square speed",
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
      rmsSpeedMetersPerSecond: Math.sqrt(
        (3 * R_GAS * temperatureK) / molarMassKgPerMol,
      ),
    };
  },
});
export const runRootMeanSquareSpeed = rootMeanSquareSpeedTool.execute;
export default rootMeanSquareSpeedTool;
