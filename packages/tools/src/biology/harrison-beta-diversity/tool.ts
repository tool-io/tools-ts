import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HarrisonBetaDiversityInput = {
  readonly sharedInt: number;
  readonly speciesAInt: number;
  readonly speciesBInt: number;
};

export type HarrisonBetaDiversityOutput = {
  readonly harrisonBeta: number;
};

export const harrisonBetaDiversityExample = {
  input: { sharedInt: 4, speciesAInt: 10, speciesBInt: 6 },
  output: { harrisonBeta: 0.5 },
} satisfies ToolExample<
  HarrisonBetaDiversityInput,
  HarrisonBetaDiversityOutput
>;

export const harrisonBetaDiversityTool = createSimpleTool({
  id: "biology/harrison-beta-diversity",
  title: "Harrison Beta",
  description:
    "Compute Harrison's normalized beta-2 turnover for two sites as (S₁ + S₂ - 2C) / (S₁ + S₂), where C is shared richness. The result is zero for identical species sets and one for disjoint sets.",
  inputs: [
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
    {
      id: "sharedInt",
      kind: "integer",
      label: "Shared species",
      minimum: 0,
      unit: "species",
    },
  ],
  outputs: [
    {
      id: "harrisonBeta",
      kind: "number",
      label: "Harrison beta diversity",
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
    const denominator = speciesAInt + speciesBInt;
    if (denominator <= 0)
      simpleError(
        "sharedInt",
        "The combined sites must contain at least one species.",
        "identical_sites",
      );
    return {
      harrisonBeta: (speciesAInt + speciesBInt - 2 * sharedInt) / denominator,
    };
  },
});
export const runHarrisonBetaDiversity = harrisonBetaDiversityTool.execute;
export default harrisonBetaDiversityTool;
