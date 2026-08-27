import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const selectionCoefficientExample = {
  input: { relativeFitnessW: 0.8 },
  output: { selectionCoefficientS: 0.19999999999999996 },
} satisfies ToolExample<
  { readonly relativeFitnessW: number },
  { readonly selectionCoefficientS: number }
>;

export const selectionCoefficientTool = createSimpleTool({
  id: "biology/selection-coefficient",
  title: "Selection Coefficient",
  description:
    "Compute the selection coefficient s = 1 - w from a relative fitness w between 0 and 1.",
  inputs: [
    {
      id: "relativeFitnessW",
      kind: "number",
      label: "Relative fitness",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "selectionCoefficientS",
      kind: "number",
      label: "Selection coefficient s",
    },
  ],
  calculate: (input) => ({
    selectionCoefficientS: 1 - (input.relativeFitnessW as number),
  }),
});
export const runSelectionCoefficient = selectionCoefficientTool.execute;
export default selectionCoefficientTool;
