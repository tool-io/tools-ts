import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SelectionDifferentialInput = {
  readonly meanSelectedParents: number;
  readonly populationMean: number;
};

export type SelectionDifferentialOutput = {
  readonly selectionDifferential: number;
};

export const selectionDifferentialExample = {
  input: { meanSelectedParents: 180.5, populationMean: 170.5 },
  output: { selectionDifferential: 10 },
} satisfies ToolExample<
  SelectionDifferentialInput,
  SelectionDifferentialOutput
>;

export const selectionDifferentialTool = createSimpleTool({
  id: "biology/selection-differential",
  title: "Selection Differential",
  description:
    "Compute the signed selection differential as the mean of selected parents minus the population mean.",
  inputs: [
    {
      id: "meanSelectedParents",
      label: "Mean of selected parents",
      kind: "number",
    },
    { id: "populationMean", label: "Population mean", kind: "number" },
  ],
  outputs: [
    {
      id: "selectionDifferential",
      label: "Selection differential",
      kind: "number",
    },
  ],
  calculate: (input) => ({
    selectionDifferential:
      (input.meanSelectedParents as number) - (input.populationMean as number),
  }),
});
export const runSelectionDifferential = selectionDifferentialTool.execute;
export default selectionDifferentialTool;
