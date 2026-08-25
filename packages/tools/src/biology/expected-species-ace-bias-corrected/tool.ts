import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const aceBiasCorrectedExample = {
  input: {
    frequencyMoment: 28,
    observedInt: 12,
    rareIndividualsInt: 20,
    rareSpeciesInt: 8,
    singletonInt: 4,
  },
  output: { biasCorrectedAce: 14 },
} satisfies ToolExample<
  {
    readonly frequencyMoment: number;
    readonly observedInt: number;
    readonly rareIndividualsInt: number;
    readonly rareSpeciesInt: number;
    readonly singletonInt: number;
  },
  { readonly biasCorrectedAce: number }
>;

export const aceBiasCorrectedTool = createSimpleTool({
  id: "biology/expected-species-ace-bias-corrected",
  title: "ACE Bias Corrected",
  description:
    "Estimate abundance-based species richness with ACE using the species observed at most ten times, their total individuals, singleton count, and the rare-frequency moment sum i(i-1)f_i. ACE is undefined when every rare individual is a singleton.",
  inputs: [
    {
      id: "observedInt",
      label: "Observed species",
      kind: "integer",
      minimum: 1,
    },
    {
      description:
        "Number of observed species represented by 1–10 individuals.",
      id: "rareSpeciesInt",
      label: "Rare species",
      kind: "integer",
      minimum: 0,
    },
    {
      description:
        "Total individuals belonging to species represented 1–10 times.",
      id: "rareIndividualsInt",
      label: "Individuals in rare species",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "singletonInt",
      label: "Singleton species",
      kind: "integer",
      minimum: 0,
    },
    {
      description: "Sum of i(i-1)f_i for abundance classes i=1 through 10.",
      id: "frequencyMoment",
      label: "Rare-frequency moment",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "biasCorrectedAce",
      label: "Bias-corrected ACE estimate",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const observedInt = input.observedInt as number;
    const rareSpeciesInt = input.rareSpeciesInt as number;
    const rareIndividualsInt = input.rareIndividualsInt as number;
    const singletonInt = input.singletonInt as number;
    const frequencyMoment = input.frequencyMoment as number;
    if (rareSpeciesInt > observedInt)
      simpleError(
        "rareSpeciesInt",
        "Rare species must not exceed total observed species.",
        "invalid_abundances",
      );
    if (singletonInt > rareSpeciesInt)
      simpleError(
        "singletonInt",
        "Singleton species must not exceed rare species.",
        "invalid_abundances",
      );
    if (rareIndividualsInt < rareSpeciesInt)
      simpleError(
        "rareIndividualsInt",
        "Rare individuals must be at least the rare-species count.",
        "invalid_abundances",
      );
    if (rareSpeciesInt === 0) {
      if (
        rareIndividualsInt !== 0 ||
        singletonInt !== 0 ||
        frequencyMoment !== 0
      )
        simpleError(
          "rareSpeciesInt",
          "Rare-group totals must all be zero when there are no rare species.",
          "invalid_abundances",
        );
      return { biasCorrectedAce: observedInt };
    }
    if (singletonInt >= rareIndividualsInt)
      simpleError(
        "singletonInt",
        "ACE is undefined when every rare individual is a singleton.",
        "zero_coverage",
      );
    const coverage = 1 - singletonInt / rareIndividualsInt;
    const gammaSquared = Math.max(
      (rareSpeciesInt / coverage) *
        (frequencyMoment / (rareIndividualsInt * (rareIndividualsInt - 1))) -
        1,
      0,
    );
    const abundantSpeciesInt = observedInt - rareSpeciesInt;
    return {
      biasCorrectedAce:
        abundantSpeciesInt +
        rareSpeciesInt / coverage +
        (singletonInt * gammaSquared) / coverage,
    };
  },
});
export const runAceBiasCorrected = aceBiasCorrectedTool.execute;
export default aceBiasCorrectedTool;
