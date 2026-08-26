import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GeneralGrowthBalanceCompletenessInput = {
  readonly registeredDeaths: number;
  readonly registeredBirths: number;
  readonly annualGrowthRate: number;
  readonly personYearsLivedBetweenCensuses: number;
};

export type GeneralGrowthBalanceCompletenessOutput = {
  readonly deathRegistrationCompleteness: number;
};

export const calculateGeneralGrowthBalanceCompleteness = (
  input: GeneralGrowthBalanceCompletenessInput,
): GeneralGrowthBalanceCompletenessOutput => {
  if (!(input.registeredDeaths >= 0))
    return simpleError(
      "registeredDeaths",
      "Registered deaths must be non-negative.",
      "invalid_deaths",
    );
  if (!(input.registeredBirths >= 0))
    return simpleError(
      "registeredBirths",
      "Registered births must be non-negative.",
      "invalid_births",
    );
  if (!Number.isFinite(input.annualGrowthRate))
    return simpleError(
      "annualGrowthRate",
      "The annual growth rate must be a finite number.",
      "invalid_growth_rate",
    );
  if (!(input.personYearsLivedBetweenCensuses > 0))
    return simpleError(
      "personYearsLivedBetweenCensuses",
      "Intercensal person-years lived must be greater than zero.",
      "invalid_person_years",
    );
  const denominator =
    input.registeredBirths -
    input.annualGrowthRate * input.personYearsLivedBetweenCensuses;
  if (!(denominator > 0))
    return simpleError(
      "registeredBirths",
      "Births must exceed growth times person-years for the balance identity to yield completeness.",
      "nonpositive_denominator",
    );
  return {
    deathRegistrationCompleteness: input.registeredDeaths / denominator,
  };
};

export const generalGrowthBalanceCompletenessExample = {
  input: {
    registeredDeaths: 12000,
    registeredBirths: 45000,
    annualGrowthRate: 0.015,
    personYearsLivedBetweenCensuses: 2000000,
  },
  output: { deathRegistrationCompleteness: 0.8 },
} satisfies ToolExample<
  GeneralGrowthBalanceCompletenessInput,
  GeneralGrowthBalanceCompletenessOutput
>;

export const generalGrowthBalanceCompletenessTool = createSimpleTool({
  id: "demography/general-growth-balance-completeness",
  title: "General Growth Balance Completeness",
  description:
    "Estimate the completeness of death registration from the aggregate general growth-balance identity B - D/c = r N, solved as c = D / (B - r N) using intercensal births, deaths, person-years and the annual growth rate.",
  inputs: [
    {
      description: "Deaths registered between the two census dates.",
      id: "registeredDeaths",
      kind: "number",
      label: "Deaths",
      minimum: 0,
    },
    {
      description:
        "Births recorded between the two census dates (coverage-adjusted where available).",
      id: "registeredBirths",
      kind: "number",
      label: "Births",
      minimum: 0,
    },
    {
      description: "Annual intercensal population growth rate per year.",
      id: "annualGrowthRate",
      kind: "number",
      label: "Growth rate",
    },
    {
      description: "Person-years lived by the population between the censuses.",
      id: "personYearsLivedBetweenCensuses",
      kind: "number",
      label: "Person-years",
    },
  ],
  outputs: [
    {
      description: "Estimated fraction of deaths captured by registration.",
      id: "deathRegistrationCompleteness",
      kind: "number",
      label: "Completeness",
    },
  ],
  calculate: (input) =>
    calculateGeneralGrowthBalanceCompleteness(
      input as unknown as GeneralGrowthBalanceCompletenessInput,
    ),
});

export const runGeneralGrowthBalanceCompleteness =
  generalGrowthBalanceCompletenessTool.execute;
export default generalGrowthBalanceCompletenessTool;
