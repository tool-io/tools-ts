import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WhittakerBetaPairwiseInput = {
  readonly sharedSpeciesInt: number;
  readonly speciesSiteAInt: number;
  readonly speciesSiteBInt: number;
};

export type WhittakerBetaPairwiseOutput = {
  readonly pairwiseWhittakerBeta: number;
};

export const whittakerBetaPairwiseExample = {
  input: { sharedSpeciesInt: 4, speciesSiteAInt: 10, speciesSiteBInt: 6 },
  output: { pairwiseWhittakerBeta: 2 },
} satisfies ToolExample<
  WhittakerBetaPairwiseInput,
  WhittakerBetaPairwiseOutput
>;

export const whittakerBetaPairwiseTool = createSimpleTool({
  id: "biology/whittaker-beta-diversity-2",
  title: "Whittaker Beta Pairwise",
  description:
    "Compute pairwise Whittaker beta diversity between two sites as the mean site species richness divided by the number of shared species.",
  inputs: [
    {
      id: "speciesSiteAInt",
      kind: "integer",
      label: "Site A species",
      minimum: 1,
      unit: "species",
    },
    {
      id: "speciesSiteBInt",
      kind: "integer",
      label: "Site B species",
      minimum: 1,
      unit: "species",
    },
    {
      id: "sharedSpeciesInt",
      kind: "integer",
      label: "Shared species",
      minimum: 0,
      unit: "species",
    },
  ],
  outputs: [
    {
      id: "pairwiseWhittakerBeta",
      kind: "number",
      label: "Pairwise Whittaker beta",
    },
  ],
  calculate: (input) => {
    const speciesSiteAInt = input.speciesSiteAInt as number;
    const speciesSiteBInt = input.speciesSiteBInt as number;
    const sharedSpeciesInt = input.sharedSpeciesInt as number;
    if (sharedSpeciesInt < 1)
      simpleError(
        "sharedSpeciesInt",
        "The sites must share at least one species.",
        "no_overlap",
      );
    return {
      pairwiseWhittakerBeta:
        (speciesSiteAInt + speciesSiteBInt) / 2 / sharedSpeciesInt,
    };
  },
});
export const runWhittakerBetaPairwise = whittakerBetaPairwiseTool.execute;
export default whittakerBetaPairwiseTool;
