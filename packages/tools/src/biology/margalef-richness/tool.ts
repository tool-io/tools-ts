import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MargalefRichnessInput = {
  readonly speciesCountInt: number;
  readonly totalIndividualsInt: number;
};

export type MargalefRichnessOutput = {
  readonly margalefRichnessIndex: number;
};

export const margalefRichnessExample = {
  input: { speciesCountInt: 8, totalIndividualsInt: 120 },
  output: { margalefRichnessIndex: 1.4621435139922037 },
} satisfies ToolExample<MargalefRichnessInput, MargalefRichnessOutput>;

export const margalefRichnessTool = createSimpleTool({
  id: "biology/margalef-richness",
  title: "Margalef Richness",
  description:
    "Compute the Margalef richness index from species count and total individuals.",
  inputs: [
    {
      id: "speciesCountInt",
      kind: "integer",
      label: "Species count",
      minimum: 1,
      unit: "species",
    },
    {
      id: "totalIndividualsInt",
      kind: "integer",
      label: "Total individuals",
      unit: "individuals",
    },
  ],
  outputs: [
    {
      id: "margalefRichnessIndex",
      kind: "number",
      label: "Margalef richness index",
    },
  ],
  calculate: (input) => {
    const totalIndividualsInt = input.totalIndividualsInt as number;
    if (totalIndividualsInt <= 1)
      simpleError(
        "totalIndividualsInt",
        "More than one individual is required for the Margalef index.",
        "insufficient_individuals",
      );
    return {
      margalefRichnessIndex:
        ((input.speciesCountInt as number) - 1) / Math.log(totalIndividualsInt),
    };
  },
});
export const runMargalefRichness = margalefRichnessTool.execute;
export default margalefRichnessTool;
