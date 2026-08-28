import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const cellPotentialExample = {
  input: { anodeReductionVolts: -0.76, cathodeReductionVolts: 0.34 },
} satisfies ToolExample<{
  readonly anodeReductionVolts: number;
  readonly cathodeReductionVolts: number;
}>;

export const cellPotentialTool = createSimpleTool({
  id: "chemistry/cell-potential",
  title: "Cell Potential Calculator",
  description:
    "Compute the cell potential as the cathode reduction potential minus the anode reduction potential.",
  inputs: [
    {
      id: "cathodeReductionVolts",
      label: "Cathode reduction potential",
      kind: "number",
      unit: "V",
    },
    {
      id: "anodeReductionVolts",
      label: "Anode reduction potential",
      kind: "number",
      unit: "V",
    },
  ],
  outputs: [
    {
      id: "cellPotentialVolts",
      label: "Cell potential",
      kind: "number",
      unit: "V",
    },
  ],
  calculate: (input) => ({
    cellPotentialVolts:
      (input.cathodeReductionVolts as number) -
      (input.anodeReductionVolts as number),
  }),
});
export const runCellPotential = cellPotentialTool.execute;
export default cellPotentialTool;
