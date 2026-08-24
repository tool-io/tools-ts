import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LatticeConstantVegardInput = {
  readonly compoundALatticeAngstrom: number;
  readonly compoundBLatticeAngstrom: number;
  readonly moleFractionX: number;
};

export type LatticeConstantVegardOutput = {
  readonly latticeConstantAngstrom: number;
};

export const latticeConstantVegardExample = {
  input: {
    compoundALatticeAngstrom: 5.6533,
    compoundBLatticeAngstrom: 5.6611,
    moleFractionX: 0.3,
  },
  output: { latticeConstantAngstrom: 5.65564 },
} satisfies ToolExample<
  LatticeConstantVegardInput,
  LatticeConstantVegardOutput
>;

export const latticeConstantVegardTool = createSimpleTool({
  calculate: (input) => {
    if (!((input.compoundALatticeAngstrom as number) > 0))
      simpleError(
        "compoundALatticeAngstrom",
        "Lattice constants must be positive.",
        "invalid_lattice_constant",
      );
    if (!((input.compoundBLatticeAngstrom as number) > 0))
      simpleError(
        "compoundBLatticeAngstrom",
        "Lattice constants must be positive.",
        "invalid_lattice_constant",
      );
    return {
      latticeConstantAngstrom:
        (input.moleFractionX as number) *
          (input.compoundBLatticeAngstrom as number) +
        (1 - (input.moleFractionX as number)) *
          (input.compoundALatticeAngstrom as number),
    };
  },
  description:
    "Interpolate the lattice constant of a binary alloy from its constituents using Vegard's law.",
  id: "semiconductor/lattice-constant-vegard",
  inputs: [
    {
      id: "moleFractionX",
      kind: "number",
      label: "Mole fraction x",
      maximum: 1,
      minimum: 0,
    },
    {
      id: "compoundALatticeAngstrom",
      kind: "number",
      label: "Compound A lattice constant",
      minimum: Number.MIN_VALUE,
      unit: "Å",
    },
    {
      id: "compoundBLatticeAngstrom",
      kind: "number",
      label: "Compound B lattice constant",
      minimum: Number.MIN_VALUE,
      unit: "Å",
    },
  ],
  outputs: [
    {
      id: "latticeConstantAngstrom",
      kind: "number",
      label: "Alloy lattice constant",
      unit: "Å",
    },
  ],
  title: "Vegard Law Lattice Constant Calculator",
});
export const runLatticeConstantVegard = latticeConstantVegardTool.execute;
export default latticeConstantVegardTool;
