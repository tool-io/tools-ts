import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    formulaUnitsPerCell: 4,
    molarMassKgPerMol: 0.05844,
    densityKgPerM3: 2160,
  },
  output: { latticeParameterM: 5.643153300306948e-10 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "chemistry/crystallography-lattice-parameter-from-density",
  title: "Cubic Lattice Parameter from Density",
  description:
    "Calculate the cubic unit-cell edge from Z formula units per cell, molar mass, and density: a³=ZM/(ρNₐ). Enter SI molar mass (kg/mol) and density (kg/m³); output is metres.",
  inputs: [
    {
      id: "formulaUnitsPerCell",
      kind: "integer",
      label: "Formula units per cell",
      minimum: 1,
    },
    {
      id: "molarMassKgPerMol",
      kind: "number",
      label: "Molar mass (kg/mol)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "densityKgPerM3",
      kind: "number",
      label: "Density (kg/m³)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "latticeParameterM", kind: "number", label: "Lattice Parameter M" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      latticeParameterM: Math.cbrt(
        (i.formulaUnitsPerCell * i.molarMassKgPerMol) /
          (i.densityKgPerM3 * 6.02214076e23),
      ),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type CrystallographyLatticeParameterFromDensityInput = Readonly<
  typeof example.input
>;
export type CrystallographyLatticeParameterFromDensityOutput = Readonly<
  typeof example.output
>;
export const crystallographyLatticeParameterFromDensityTool = tool;
export const runCrystallographyLatticeParameterFromDensity = tool.execute;
export default tool;
