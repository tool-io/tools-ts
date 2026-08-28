import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const cellPotentialFromGibbsTool = createSimpleTool({
  id: "chemistry/cell-potential-from-gibbs",
  title: "Cell Potential From Gibbs Calculator",
  description:
    "Convert Gibbs free energy change to cell potential via E° = −ΔG/(nF).",
  inputs: [
    {
      description: "Gibbs free energy change in joules.",
      id: "deltaGJ",
      label: "ΔG",
      kind: "number",
      unit: "J",
    },
    {
      description:
        "Electrons transferred per mole of reaction; must be nonzero.",
      id: "electronsTransferred",
      label: "Electrons transferred",
      kind: "integer",
    },
  ],
  outputs: [
    {
      description: "Cell potential in volts.",
      id: "cellPotentialV",
      label: "Cell potential",
      kind: "number",
      unit: "V",
    },
  ],
  calculate: (input) => {
    const electrons = input.electronsTransferred as number;
    if (electrons === 0)
      simpleError(
        "electronsTransferred",
        "The electron count must be nonzero.",
        "invalid_electron_count",
      );
    const F = 96485;
    return { cellPotentialV: -(input.deltaGJ as number) / (electrons * F) };
  },
});
export const runCellPotentialFromGibbs = cellPotentialFromGibbsTool.execute;
export default cellPotentialFromGibbsTool;

export type CellPotentialFromGibbsInput = {
  readonly deltaGJ: number;
  readonly electronsTransferred: number;
};

export type CellPotentialFromGibbsOutput = {
  readonly cellPotentialV: number;
};

export const cellPotentialFromGibbsExample = {
  input: {
    deltaGJ: 1,
    electronsTransferred: 1,
  },
  output: {
    cellPotentialV: -0.000010364305332435094,
  },
} satisfies ToolExample<
  CellPotentialFromGibbsInput,
  CellPotentialFromGibbsOutput
>;
