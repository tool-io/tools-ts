import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const molecularWeightFromVaporDensityTool = createSimpleTool({
  id: "chemistry/molecular-weight-from-vapor-density",
  title: "Molecular Weight From Vapor Density Calculator",
  description:
    "Compute molar mass from vapor density via the ideal gas relation M = dRT/P.",
  inputs: [
    {
      description: "Vapor density in grams per liter.",
      id: "densityGL",
      label: "Density",
      kind: "number",
      unit: "g/L",
    },
    {
      description: "Absolute temperature; must be greater than zero.",
      id: "temperatureK",
      label: "Temperature",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
    {
      description: "Pressure in atmospheres; must be greater than zero.",
      id: "pressureAtm",
      label: "Pressure",
      kind: "number",
      minimum: 0,
      unit: "atm",
    },
  ],
  outputs: [
    {
      description: "Molar mass of the vapor.",
      id: "molarMassGMol",
      label: "Molar mass",
      kind: "number",
      unit: "g/mol",
    },
  ],
  calculate: (input) => {
    const R = 0.08206;
    const pressure = input.pressureAtm as number;
    if (pressure <= 0)
      simpleError(
        "pressureAtm",
        "The pressure must be greater than zero atmospheres.",
        "invalid_pressure",
      );
    const temperature = input.temperatureK as number;
    if (temperature <= 0)
      simpleError(
        "temperatureK",
        "The temperature must be greater than zero kelvin.",
        "invalid_temperature",
      );
    return {
      molarMassGMol: ((input.densityGL as number) * R * temperature) / pressure,
    };
  },
});
export const runMolecularWeightFromVaporDensity =
  molecularWeightFromVaporDensityTool.execute;
export default molecularWeightFromVaporDensityTool;

export type MolecularWeightFromVaporDensityInput = {
  readonly densityGL: number;
  readonly temperatureK: number;
  readonly pressureAtm: number;
};

export type MolecularWeightFromVaporDensityOutput = {
  readonly molarMassGMol: number;
};

export const molecularWeightFromVaporDensityExample = {
  input: {
    densityGL: 1,
    temperatureK: 1,
    pressureAtm: 1,
  },
  output: {
    molarMassGMol: 0.08206,
  },
} satisfies ToolExample<
  MolecularWeightFromVaporDensityInput,
  MolecularWeightFromVaporDensityOutput
>;
