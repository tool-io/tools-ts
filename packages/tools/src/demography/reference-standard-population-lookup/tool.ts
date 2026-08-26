import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReferenceStandardPopulationLookupInput = {
  readonly standard: "segiWorld" | "european" | "whoWorld2000" | "us2000";
};

export type ReferenceStandardPopulationLookupOutput = {
  readonly fullName: string;
  readonly originNote: string;
  readonly primaryUse: string;
};

const STANDARD_NAME = {
  segiWorld: "Segi world standard population",
  european: "European standard population",
  whoWorld2000: "WHO world standard population",
  us2000: "US 2000 standard population",
} as const;

const STANDARD_ORIGIN = {
  segiWorld:
    "Constructed by Mitsuru Segi from the populations of 46 countries around 1960.",
  european:
    "Long-standing European variant derived from Segi's construction for comparisons across European populations.",
  whoWorld2000:
    "Developed by the World Health Organization from United Nations world population prospects covering 2000 to 2025.",
  us2000:
    "Year 2000 projected United States population adopted by NCHS in 1999 for age adjustment of US data.",
} as const;

const STANDARD_USE = {
  segiWorld:
    "Age-standardized cancer incidence and mortality comparisons across countries and over time.",
  european:
    "Age-standardized rates in European and international health statistics reporting.",
  whoWorld2000:
    "WHO cross-country comparisons of mortality and disease burden rates.",
  us2000:
    "Age adjustment of United States vital statistics and survey-based health rates.",
} as const;

export const calculateReferenceStandardPopulationLookup = (
  input: ReferenceStandardPopulationLookupInput,
): ReferenceStandardPopulationLookupOutput => {
  if (!(input.standard in STANDARD_NAME))
    simpleError(
      "standard",
      "Choose one of the documented reference standard populations.",
      "invalid_standard",
    );
  return {
    fullName: STANDARD_NAME[input.standard],
    originNote: STANDARD_ORIGIN[input.standard],
    primaryUse: STANDARD_USE[input.standard],
  };
};

export const referenceStandardPopulationLookupExample = {
  input: { standard: "segiWorld" },
  output: {
    fullName: "Segi world standard population",
    originNote:
      "Constructed by Mitsuru Segi from the populations of 46 countries around 1960.",
    primaryUse:
      "Age-standardized cancer incidence and mortality comparisons across countries and over time.",
  },
} satisfies ToolExample<
  ReferenceStandardPopulationLookupInput,
  ReferenceStandardPopulationLookupOutput
>;

export const referenceStandardPopulationLookupTool = createSimpleTool({
  id: "demography/reference-standard-population-lookup",
  title: "Reference Standard Population Lookup",
  description:
    "Identify a widely used reference standard population by name, origin and typical application so that users can pair it with their own published age weights when direct-standardizing rates.",
  inputs: [
    {
      description: "Reference standard population of interest.",
      enum: ["segiWorld", "european", "whoWorld2000", "us2000"],
      id: "standard",
      kind: "string",
      label: "Standard",
    },
  ],
  outputs: [
    {
      description: "Full conventional name of the standard.",
      id: "fullName",
      kind: "string",
      label: "Name",
    },
    {
      description: "Documented origin of the standard distribution.",
      id: "originNote",
      kind: "string",
      label: "Origin",
    },
    {
      description: "Typical application of this standard.",
      id: "primaryUse",
      kind: "string",
      label: "Primary use",
    },
  ],
  calculate: (input) =>
    calculateReferenceStandardPopulationLookup(
      input as unknown as ReferenceStandardPopulationLookupInput,
    ),
});

export const runReferenceStandardPopulationLookup =
  referenceStandardPopulationLookupTool.execute;
export default referenceStandardPopulationLookupTool;
