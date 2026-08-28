import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const equilibriumFromCellPotentialExample = {
  input: { eStandardVolts: 1.1, electronCount: 2 },
} satisfies ToolExample<{
  readonly eStandardVolts: number;
  readonly electronCount: number;
}>;

export const equilibriumFromCellPotentialTool = createSimpleTool({
  id: "chemistry/equilibrium-from-cell-potential",
  title: "Log K From Cell Potential",
  description:
    "Compute the base-10 logarithm of the equilibrium constant as electron count times standard cell potential divided by 0.0592.",
  inputs: [
    {
      id: "eStandardVolts",
      label: "Standard cell potential",
      kind: "number",
      unit: "V",
    },
    {
      id: "electronCount",
      label: "Electrons transferred",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "logEquilibriumConstant",
      label: "log10 K",
      kind: "number",
      unit: "dimensionless",
    },
  ],
  calculate: (input) => ({
    logEquilibriumConstant:
      ((input.electronCount as number) * (input.eStandardVolts as number)) /
      0.0592,
  }),
});
export const runEquilibriumFromCellPotential =
  equilibriumFromCellPotentialTool.execute;
export default equilibriumFromCellPotentialTool;
