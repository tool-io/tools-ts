import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CurrentDividerInput = {
  readonly branchResistanceOhms: number;
  readonly otherResistanceOhms: number;
  readonly totalCurrentA: number;
};

export type CurrentDividerOutput = {
  readonly branchCurrentA: number;
};

export const currentDividerExample = {
  input: {
    branchResistanceOhms: 100,
    otherResistanceOhms: 300,
    totalCurrentA: 3,
  },
  output: { branchCurrentA: 2.25 },
} satisfies ToolExample<CurrentDividerInput, CurrentDividerOutput>;

export const calculateCurrentDivider = (
  input: CurrentDividerInput,
): CurrentDividerOutput => {
  if (input.branchResistanceOhms <= 0 || input.otherResistanceOhms <= 0)
    simpleError(
      "branchResistanceOhms",
      "Branch resistances must be positive for current division.",
      "invalid_input",
    );
  return {
    branchCurrentA:
      input.totalCurrentA *
      (input.otherResistanceOhms /
        (input.branchResistanceOhms + input.otherResistanceOhms)),
  };
};

export const currentDividerTool = createSimpleTool({
  calculate: (input) =>
    calculateCurrentDivider(input as unknown as CurrentDividerInput),
  description:
    "Compute the current through one branch of two parallel resistances: Ix = It * Rother / (Rx + Rother); the lower-resistance branch carries more current.",
  id: "electronics/current-divider",
  inputs: [
    {
      description: "Total current entering the parallel pair.",
      id: "totalCurrentA",
      kind: "number",
      label: "Total current",
      unit: "A",
    },
    {
      description: "Resistance of the branch whose current is sought.",
      id: "branchResistanceOhms",
      kind: "number",
      label: "Branch resistance",
      unit: "Ω",
    },
    {
      description: "Resistance of the remaining parallel branch.",
      id: "otherResistanceOhms",
      kind: "number",
      label: "Other resistance",
      unit: "Ω",
    },
  ],
  outputs: [
    {
      description: "Current flowing through the selected branch.",
      id: "branchCurrentA",
      kind: "number",
      label: "Branch current",
      unit: "A",
    },
  ],
  title: "Current Divider Calculator",
});
export const runCurrentDivider = currentDividerTool.execute;
export default currentDividerTool;
