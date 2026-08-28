import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const gibbsFromCellPotentialTool = createSimpleTool({
  id: "chemistry/gibbs-from-cell-potential",
  title: "Gibbs Free Energy From Cell Potential Calculator",
  description:
    "Convert cell potential to Gibbs free energy via ΔG = −nFE with F = 96485 C/mol.",
  inputs: [
    {
      description: "Cell potential in volts.",
      id: "cellPotentialV",
      label: "Cell potential",
      kind: "number",
      unit: "V",
    },
    {
      description: "Electrons transferred per mole of reaction.",
      id: "electronsTransferred",
      label: "Electrons transferred",
      kind: "integer",
    },
    {
      default: 1,
      description: "Moles of reaction; defaults to one mole.",
      id: "molesReaction",
      label: "Moles of reaction",
      kind: "number",
      minimum: 0,
      required: false,
      unit: "mol",
    },
  ],
  outputs: [
    {
      description: "Gibbs free energy change in kilojoules.",
      id: "deltaGKJ",
      label: "ΔG",
      kind: "number",
      unit: "kJ",
    },
  ],
  calculate: (input) => {
    const electrons = input.electronsTransferred as number;
    if (!(electrons > 0))
      simpleError(
        "electronsTransferred",
        "The electron count must be greater than zero.",
        "invalid_electron_count",
      );
    const F = 96485;
    const joules =
      -(electrons * F * (input.cellPotentialV as number)) *
      ((input.molesReaction ?? 1) as number);
    return { deltaGKJ: joules / 1000 };
  },
});
export const runGibbsFromCellPotential = gibbsFromCellPotentialTool.execute;
export default gibbsFromCellPotentialTool;

export type GibbsFromCellPotentialInput = {
  readonly cellPotentialV: number;
  readonly electronsTransferred: number;
  readonly molesReaction: number;
};

export type GibbsFromCellPotentialOutput = {
  readonly deltaGKJ: number;
};

export const gibbsFromCellPotentialExample = {
  input: {
    cellPotentialV: 1,
    electronsTransferred: 1,
    molesReaction: 1,
  },
  output: {
    deltaGKJ: -96.485,
  },
} satisfies ToolExample<
  GibbsFromCellPotentialInput,
  GibbsFromCellPotentialOutput
>;
