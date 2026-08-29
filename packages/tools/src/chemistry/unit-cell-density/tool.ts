import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UnitCellDensityInput = {
  readonly atomsPerUnitCell: number;
  readonly edgeLengthPicometers: number;
  readonly molarMassGPerMol: number;
};

export type UnitCellDensityOutput = {
  readonly densityGPerCm3: number;
};

export const unitCellDensityExample = {
  input: {
    atomsPerUnitCell: 4,
    edgeLengthPicometers: 564,
    molarMassGPerMol: 58.44,
  },
  output: { densityGPerCm3: 2.16362496672666 },
} satisfies ToolExample<UnitCellDensityInput, UnitCellDensityOutput>;

const avogadroPerMole = 6.02214076e23;

export const calculateUnitCellDensity = (
  input: UnitCellDensityInput,
): UnitCellDensityOutput => {
  if (input.edgeLengthPicometers <= 0)
    simpleError(
      "edgeLengthPicometers",
      "The unit cell edge must be positive.",
      "invalid_value",
    );
  if (input.molarMassGPerMol <= 0)
    simpleError(
      "molarMassGPerMol",
      "Molar mass must be positive.",
      "invalid_value",
    );
  const edgeCm = input.edgeLengthPicometers * 1e-10;
  return {
    densityGPerCm3:
      (input.atomsPerUnitCell * input.molarMassGPerMol) /
      (avogadroPerMole * edgeCm ** 3),
  };
};

export const UnitCellDensityTool = createSimpleTool({
  calculate: (input) =>
    calculateUnitCellDensity(input as unknown as UnitCellDensityInput),
  description:
    "Compute the theoretical crystal density rho = Z*M/(N_A*a^3) from the atoms per unit cell, molar mass, and cubic edge length.",
  id: "chemistry/unit-cell-density",
  inputs: [
    {
      description: "Number of formula units per unit cell.",
      id: "atomsPerUnitCell",
      kind: "integer",
      label: "Atoms per unit cell",
      minimum: 1,
    },
    {
      description: "Cubic unit cell edge length in picometres.",
      id: "edgeLengthPicometers",
      kind: "number",
      label: "Edge length",
      minimum: 0,
      unit: "pm",
    },
    {
      description: "Molar mass of the substance in grams per mole.",
      id: "molarMassGPerMol",
      kind: "number",
      label: "Molar mass",
      minimum: 0,
      unit: "g/mol",
    },
  ],
  outputs: [
    {
      description: "Theoretical crystal density.",
      id: "densityGPerCm3",
      kind: "number",
      label: "Density",
      unit: "g/cm³",
    },
  ],
  title: "Unit Cell Density Calculator",
});
export const runUnitCellDensity = UnitCellDensityTool.execute;
export default UnitCellDensityTool;
