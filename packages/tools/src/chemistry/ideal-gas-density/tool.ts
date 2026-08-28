import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const R_GAS_L_ATM = 0.08205736608096;

export const idealGasDensityExample = {
  input: { molarMassGPerMol: 28.97, pressureAtm: 1, temperatureK: 273.15 },
} satisfies ToolExample<{
  readonly molarMassGPerMol: number;
  readonly pressureAtm: number;
  readonly temperatureK: number;
}>;

export const idealGasDensityTool = createSimpleTool({
  id: "chemistry/ideal-gas-density",
  title: "Ideal Gas Density",
  description:
    "Compute ideal gas density in g/L as molar mass times pressure over R times temperature using the gas constant in L-atm.",
  inputs: [
    {
      id: "molarMassGPerMol",
      label: "Molar mass",
      kind: "number",
      unit: "g/mol",
    },
    { id: "pressureAtm", label: "Pressure", kind: "number", unit: "atm" },
    { id: "temperatureK", label: "Temperature", kind: "number", unit: "K" },
  ],
  outputs: [
    { id: "densityGPL", label: "Density", kind: "number", unit: "g/L" },
  ],
  calculate: (input) => {
    const molarMassGPerMol = input.molarMassGPerMol as number;
    const pressureAtm = input.pressureAtm as number;
    const temperatureK = input.temperatureK as number;
    if (!(molarMassGPerMol > 0))
      simpleError("molarMassGPerMol", "Molar mass must be positive.");
    if (!(pressureAtm > 0))
      simpleError("pressureAtm", "Pressure must be positive.");
    if (!(temperatureK > 0))
      simpleError("temperatureK", "Temperature must be positive.");
    return {
      densityGPL:
        (molarMassGPerMol * pressureAtm) / (R_GAS_L_ATM * temperatureK),
    };
  },
});
export const runIdealGasDensity = idealGasDensityTool.execute;
export default idealGasDensityTool;
