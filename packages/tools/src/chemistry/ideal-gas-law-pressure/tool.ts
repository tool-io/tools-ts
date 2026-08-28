import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const R_GAS = 8.314462618;

export const idealGasLawPressureExample = {
  input: { moles: 1, temperatureK: 300, volumeM3: 1 },
} satisfies ToolExample<{
  readonly moles: number;
  readonly temperatureK: number;
  readonly volumeM3: number;
}>;

export const idealGasLawPressureTool = createSimpleTool({
  id: "chemistry/ideal-gas-law-pressure",
  title: "Ideal Gas Pressure",
  description:
    "Compute the pressure of an ideal gas as moles times R times temperature over volume.",
  inputs: [
    { id: "moles", label: "Amount of gas", kind: "number", unit: "mol" },
    { id: "temperatureK", label: "Temperature", kind: "number", unit: "K" },
    { id: "volumeM3", label: "Volume", kind: "number", unit: "m^3" },
  ],
  outputs: [
    { id: "pressurePa", label: "Pressure", kind: "number", unit: "Pa" },
  ],
  calculate: (input) => {
    const moles = input.moles as number;
    const temperatureK = input.temperatureK as number;
    const volumeM3 = input.volumeM3 as number;
    if (!(moles > 0)) simpleError("moles", "Amount of gas must be positive.");
    if (!(temperatureK > 0))
      simpleError("temperatureK", "Temperature must be positive.");
    if (!(volumeM3 > 0)) simpleError("volumeM3", "Volume must be positive.");
    return { pressurePa: (moles * R_GAS * temperatureK) / volumeM3 };
  },
});
export const runIdealGasLawPressure = idealGasLawPressureTool.execute;
export default idealGasLawPressureTool;
