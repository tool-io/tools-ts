import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const speciesRichnessExample = {
  input: { distinctSpeciesCount: 12 },
  output: { speciesRichness: 12 },
} satisfies ToolExample<
  { readonly distinctSpeciesCount: number },
  { readonly speciesRichness: number }
>;

export const speciesRichnessTool = createSimpleTool({
  id: "biology/species-richness",
  title: "Species Richness",
  description: "Report the number of distinct species observed in a community.",
  inputs: [
    {
      id: "distinctSpeciesCount",
      kind: "integer",
      label: "Distinct species count",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "speciesRichness",
      kind: "integer",
      label: "Species richness",
    },
  ],
  calculate: (input) => ({
    speciesRichness: input.distinctSpeciesCount as number,
  }),
});
export const runSpeciesRichness = speciesRichnessTool.execute;
export default speciesRichnessTool;
