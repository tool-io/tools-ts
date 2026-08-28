import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const R_GAS = 8.314462618;

export const mostProbableSpeedExample = {
  input: { molarMassKgPerMol: 0.032, temperatureK: 300 },
} satisfies ToolExample<{
  readonly molarMassKgPerMol: number;
  readonly temperatureK: number;
}>;

export const mostProbableSpeedTool = createSimpleTool({
  id: "chemistry/most-probable-speed",
  title: "Most Probable Speed",
  description:
    "Compute the most probable molecular speed of a gas from temperature and molar mass.",
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
      id: "mostProbableSpeedMetersPerSecond",
      label: "Most probable speed",
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
      mostProbableSpeedMetersPerSecond: Math.sqrt(
        (2 * R_GAS * temperatureK) / molarMassKgPerMol,
      ),
    };
  },
});
export const runMostProbableSpeed = mostProbableSpeedTool.execute;
export default mostProbableSpeedTool;
