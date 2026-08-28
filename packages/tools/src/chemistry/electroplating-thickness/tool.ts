import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const electroplatingThicknessTool = createSimpleTool({
  id: "chemistry/electroplating-thickness",
  title: "Electroplating Thickness Calculator",
  description:
    "Compute deposited metal layer thickness from Faraday's law of electrolysis and convert to micrometers.",
  inputs: [
    {
      description: "Plating current.",
      id: "currentA",
      label: "Current",
      kind: "number",
      minimum: 0,
      unit: "A",
    },
    {
      description: "Plating duration; must be greater than zero.",
      id: "seconds",
      label: "Time",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      description: "Molar mass of the plated metal.",
      id: "molarMassGMol",
      label: "Molar mass",
      kind: "number",
      minimum: 0,
      unit: "g/mol",
    },
    {
      description:
        "Electrons transferred per mole of deposited metal; must be nonzero.",
      id: "valence",
      label: "Valence",
      kind: "integer",
    },
    {
      description: "Density of the deposited metal; must be greater than zero.",
      id: "densityGCm3",
      label: "Density",
      kind: "number",
      minimum: 0,
      unit: "g/cm³",
    },
    {
      description:
        "Plated surface area in square centimeters; must be greater than zero.",
      id: "areaCm2",
      label: "Area",
      kind: "number",
      minimum: 0,
      unit: "cm²",
    },
  ],
  outputs: [
    {
      description: "Deposited layer thickness in micrometers.",
      id: "thicknessMicrometers",
      label: "Thickness",
      kind: "number",
      unit: "µm",
    },
  ],
  calculate: (input) => {
    const F = 96485;
    const valence = input.valence as number;
    const density = input.densityGCm3 as number;
    const area = input.areaCm2 as number;
    const seconds = input.seconds as number;
    if (
      valence <= 0 ||
      density <= 0 ||
      area <= 0 ||
      seconds <= 0 ||
      !((input.molarMassGMol as number) > 0)
    )
      simpleError(
        "valence",
        "Electron count, molar mass, density, area, and time must all be positive.",
        "invalid_electroplating_input",
      );
    const moles = ((input.currentA as number) * seconds) / (valence * F);
    const massG = moles * (input.molarMassGMol as number);
    const volumeCm3 = massG / density;
    return { thicknessMicrometers: (volumeCm3 / area) * 10000 };
  },
});
export const runElectroplatingThickness = electroplatingThicknessTool.execute;
export default electroplatingThicknessTool;

export type ElectroplatingThicknessInput = {
  readonly currentA: number;
  readonly seconds: number;
  readonly molarMassGMol: number;
  readonly valence: number;
  readonly densityGCm3: number;
  readonly areaCm2: number;
};

export type ElectroplatingThicknessOutput = {
  readonly thicknessMicrometers: number;
};

export const electroplatingThicknessExample = {
  input: {
    currentA: 1,
    seconds: 1,
    molarMassGMol: 1,
    valence: 1,
    densityGCm3: 1,
    areaCm2: 1,
  },
  output: {
    thicknessMicrometers: 0.10364305332435093,
  },
} satisfies ToolExample<
  ElectroplatingThicknessInput,
  ElectroplatingThicknessOutput
>;
