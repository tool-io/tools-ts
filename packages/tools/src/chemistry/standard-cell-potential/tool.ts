import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const standardCellPotentialExample = {
  input: {
    standardAnodeReductionVolts: -0.34,
    standardCathodeReductionVolts: 0.8,
  },
} satisfies ToolExample<{
  readonly standardAnodeReductionVolts: number;
  readonly standardCathodeReductionVolts: number;
}>;

export const standardCellPotentialTool = createSimpleTool({
  id: "chemistry/standard-cell-potential",
  title: "Standard Cell Potential",
  description:
    "Compute E°cell = E°cathode(reduction) - E°anode(reduction) from tabulated standard reduction potentials.",
  inputs: [
    {
      id: "standardCathodeReductionVolts",
      label: "Standard cathode reduction potential",
      kind: "number",
      unit: "V",
    },
    {
      id: "standardAnodeReductionVolts",
      label: "Standard anode reduction potential",
      kind: "number",
      unit: "V",
    },
  ],
  outputs: [
    {
      id: "standardCellPotentialVolts",
      label: "Standard cell potential",
      kind: "number",
      unit: "V",
    },
  ],
  calculate: (input) => ({
    standardCellPotentialVolts:
      (input.standardCathodeReductionVolts as number) -
      (input.standardAnodeReductionVolts as number),
  }),
});
export const runStandardCellPotential = standardCellPotentialTool.execute;
export default standardCellPotentialTool;
