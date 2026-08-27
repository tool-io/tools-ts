import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WhittakerBetaDiversityInput = {
  readonly sharedInt: number;
  readonly speciesAInt: number;
  readonly speciesBInt: number;
};

export type WhittakerBetaDiversityOutput = {
  readonly whittakerBeta: number;
};

export const whittakerBetaDiversityExample = {
  input: { sharedInt: 5, speciesAInt: 10, speciesBInt: 10 },
  output: { whittakerBeta: 1.2 },
} satisfies ToolExample<
  WhittakerBetaDiversityInput,
  WhittakerBetaDiversityOutput
>;

export const whittakerBetaDiversityTool = createSimpleTool({
  id: "biology/whittaker-beta-diversity",
  title: "Whittaker Beta Diversity",
  description:
    "Compute Whittaker beta diversity betaW = gamma / mean alpha richness from two site species counts and their shared count.",
  inputs: [
    {
      id: "sharedInt",
      kind: "integer",
      label: "Shared species",
      minimum: 0,
      unit: "species",
    },
    {
      id: "speciesAInt",
      kind: "integer",
      label: "Site A species",
      minimum: 0,
      unit: "species",
    },
    {
      id: "speciesBInt",
      kind: "integer",
      label: "Site B species",
      minimum: 0,
      unit: "species",
    },
  ],
  outputs: [
    {
      id: "whittakerBeta",
      kind: "number",
      label: "Whittaker beta diversity",
    },
  ],
  calculate: (input) => {
    const speciesAInt = input.speciesAInt as number;
    const speciesBInt = input.speciesBInt as number;
    const sharedInt = input.sharedInt as number;
    if (sharedInt > speciesAInt || sharedInt > speciesBInt)
      simpleError(
        "sharedInt",
        "The shared species count cannot exceed either site total.",
        "invalid_sets",
      );
    return {
      whittakerBeta:
        (speciesAInt + speciesBInt - sharedInt) /
        ((speciesAInt + speciesBInt + sharedInt) / 2),
    };
  },
});
export const runWhittakerBetaDiversity = whittakerBetaDiversityTool.execute;
export default whittakerBetaDiversityTool;
