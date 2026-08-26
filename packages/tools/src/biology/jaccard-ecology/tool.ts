import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const jaccardEcologyExample = {
  input: { sharedSpecies: 2, speciesA: 5, speciesB: 3 },
  output: { jaccardIndex: 0.3333333333333333 },
} satisfies ToolExample<
  {
    readonly sharedSpecies: number;
    readonly speciesA: number;
    readonly speciesB: number;
  },
  { readonly jaccardIndex: number }
>;

export const jaccardEcologyTool = createSimpleTool({
  id: "biology/jaccard-ecology",
  title: "Jaccard Index",
  description:
    "Compute the Jaccard similarity index between two species counts.",
  inputs: [
    {
      id: "speciesA",
      kind: "integer",
      label: "Species in community A",
      minimum: 0,
    },
    {
      id: "speciesB",
      kind: "integer",
      label: "Species in community B",
      minimum: 0,
    },
    {
      id: "sharedSpecies",
      kind: "integer",
      label: "Shared species",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "jaccardIndex",
      kind: "number",
      label: "Jaccard index",
    },
  ],
  calculate: (input) => {
    const speciesA = input.speciesA as number;
    const speciesB = input.speciesB as number;
    const sharedSpecies = input.sharedSpecies as number;
    if (sharedSpecies > speciesA || sharedSpecies > speciesB)
      simpleError(
        "sharedSpecies",
        "Shared species cannot exceed either community's species count.",
        "invalid_sets",
      );
    const union = speciesA + speciesB - sharedSpecies;
    if (union <= 0)
      simpleError(
        "sharedSpecies",
        "The union of both communities must contain at least one species.",
        "invalid_sets",
      );
    return { jaccardIndex: sharedSpecies / union };
  },
});
export const runJaccardEcology = jaccardEcologyTool.execute;
export default jaccardEcologyTool;
