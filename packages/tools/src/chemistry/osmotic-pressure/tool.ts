import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OsmoticPressureInput = {
  readonly molarityM: number;
  readonly temperatureK: number;
  readonly vantHoffFactor?: number;
};

export type OsmoticPressureOutput = {
  readonly osmoticPressureAtm: number;
};

const R_L_ATM = 0.08205736608096;

export const osmoticPressureExample = {
  input: { molarityM: 0.5, temperatureK: 300, vantHoffFactor: 2 },
  output: { osmoticPressureAtm: 24.617209824287997 },
} satisfies ToolExample<OsmoticPressureInput, OsmoticPressureOutput>;

export const osmoticPressureTool = createSimpleTool({
  id: "chemistry/osmotic-pressure",
  title: "Osmotic Pressure Calculator",
  description:
    "Compute osmotic pressure from molarity, temperature, and the van 't Hoff factor.",
  inputs: [
    { id: "molarityM", label: "Molarity", kind: "number", unit: "mol/L" },
    {
      id: "temperatureK",
      label: "Temperature",
      kind: "number",
      unit: "K",
    },
    {
      default: 1,
      id: "vantHoffFactor",
      kind: "integer",
      label: "van 't Hoff factor",
    },
  ],
  outputs: [
    {
      id: "osmoticPressureAtm",
      label: "Osmotic pressure",
      kind: "number",
      unit: "atm",
    },
  ],
  calculate: (input) => {
    const molarityM = input.molarityM as number;
    const temperatureK = input.temperatureK as number;
    const vantHoffFactor = input.vantHoffFactor as number;
    if (molarityM <= 0) simpleError("molarityM", "Molarity must be positive.");
    if (temperatureK <= 0)
      simpleError("temperatureK", "Temperature must be positive.");
    return {
      osmoticPressureAtm: molarityM * vantHoffFactor * R_L_ATM * temperatureK,
    };
  },
});
export const runOsmoticPressure = osmoticPressureTool.execute;
export default osmoticPressureTool;
