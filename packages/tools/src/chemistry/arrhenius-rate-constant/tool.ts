import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const R_GAS = 8.314462618;

export const arrheniusRateConstantExample = {
  input: {
    activationEnergyJPerMol: 50000,
    frequencyFactorPerS: 1e13,
    temperatureK: 300,
  },
} satisfies ToolExample<{
  readonly activationEnergyJPerMol: number;
  readonly frequencyFactorPerS: number;
  readonly temperatureK: number;
}>;

export const arrheniusRateConstantTool = createSimpleTool({
  id: "chemistry/arrhenius-rate-constant",
  title: "Arrhenius Rate Constant",
  description:
    "Compute the Arrhenius rate constant as the frequency factor times exp of minus activation energy over R times temperature.",
  inputs: [
    {
      id: "frequencyFactorPerS",
      label: "Frequency factor A",
      kind: "number",
      unit: "1/s",
    },
    {
      id: "activationEnergyJPerMol",
      label: "Activation energy",
      kind: "number",
      unit: "J/mol",
    },
    { id: "temperatureK", label: "Temperature", kind: "number", unit: "K" },
  ],
  outputs: [
    {
      id: "rateConstantPerS",
      label: "Rate constant k",
      kind: "number",
      unit: "1/s",
    },
  ],
  calculate: (input) => {
    const frequencyFactorPerS = input.frequencyFactorPerS as number;
    const activationEnergyJPerMol = input.activationEnergyJPerMol as number;
    const temperatureK = input.temperatureK as number;
    if (!(frequencyFactorPerS > 0))
      simpleError("frequencyFactorPerS", "Frequency factor must be positive.");
    if (activationEnergyJPerMol < 0)
      simpleError(
        "activationEnergyJPerMol",
        "Activation energy must not be negative.",
      );
    if (!(temperatureK > 0))
      simpleError("temperatureK", "Temperature must be positive.");
    return {
      rateConstantPerS:
        frequencyFactorPerS *
        Math.exp(-activationEnergyJPerMol / (R_GAS * temperatureK)),
    };
  },
});
export const runArrheniusRateConstant = arrheniusRateConstantTool.execute;
export default arrheniusRateConstantTool;
