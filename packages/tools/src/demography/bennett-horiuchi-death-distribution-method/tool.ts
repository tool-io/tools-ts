import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BennettHoriuchiDeathDistributionMethodInput = {
  readonly baseAge: number;
  readonly deathsByFiveYearAgeGroup: readonly number[];
  readonly annualGrowthRate: number;
  readonly personYearsAboveBase: number;
};

export type BennettHoriuchiDeathDistributionMethodOutput = {
  readonly deathRegistrationCompleteness: number;
  readonly expectedDeathsAboveBase: number;
};

export const calculateBennettHoriuchiDeathDistributionMethod = (
  input: BennettHoriuchiDeathDistributionMethodInput,
): BennettHoriuchiDeathDistributionMethodOutput => {
  if (!Number.isSafeInteger(input.baseAge) || input.baseAge < 0)
    return simpleError(
      "baseAge",
      "The base age must be a non-negative integer.",
      "invalid_age",
    );
  if (input.deathsByFiveYearAgeGroup.length < 1)
    return simpleError(
      "deathsByFiveYearAgeGroup",
      "Provide at least one five-year age-group death count.",
      "invalid_deaths",
    );
  for (const deaths of input.deathsByFiveYearAgeGroup) {
    if (!(deaths >= 0))
      return simpleError(
        "deathsByFiveYearAgeGroup",
        "Death counts must be non-negative.",
        "invalid_deaths",
      );
  }
  if (
    !Number.isFinite(input.annualGrowthRate) ||
    Math.abs(input.annualGrowthRate) >= 0.2
  )
    return simpleError(
      "annualGrowthRate",
      "The annual growth rate must be finite and small in magnitude.",
      "invalid_growth_rate",
    );
  if (!(input.personYearsAboveBase > 0))
    return simpleError(
      "personYearsAboveBase",
      "Person-years lived above the base age must be greater than zero.",
      "invalid_person_years",
    );
  let expectedDeathsAboveBase = 0;
  for (
    let group = 0;
    group < input.deathsByFiveYearAgeGroup.length;
    group += 1
  ) {
    expectedDeathsAboveBase +=
      input.deathsByFiveYearAgeGroup[group] *
      Math.exp(-input.annualGrowthRate * 5 * group);
  }
  return {
    deathRegistrationCompleteness:
      expectedDeathsAboveBase / input.personYearsAboveBase,
    expectedDeathsAboveBase,
  };
};

export const bennettHoriuchiDeathDistributionMethodExample = {
  input: {
    baseAge: 10,
    deathsByFiveYearAgeGroup: [1000, 800],
    annualGrowthRate: 0.02,
    personYearsAboveBase: 5000,
  },
  output: {
    deathRegistrationCompleteness: 0.3447739868857535,
    expectedDeathsAboveBase: 1723.8699344287675,
  },
} satisfies ToolExample<
  BennettHoriuchiDeathDistributionMethodInput,
  BennettHoriuchiDeathDistributionMethodOutput
>;

export const bennettHoriuchiDeathDistributionMethodTool = createSimpleTool({
  id: "demography/bennett-horiuchi-death-distribution-method",
  title: "Bennett Horiuchi Death Distribution Method",
  description:
    "Estimate death-registration completeness with the Bennett-Horiuchi synthetic extinct generations method: discount reported deaths above a base age back over the interval with the stable-population growth rate and compare their sum to intercensal person-years lived above that age.",
  inputs: [
    {
      description: "Base age of the first reported five-year age group.",
      id: "baseAge",
      kind: "integer",
      label: "Base age",
      minimum: 0,
    },
    {
      description:
        "Reported deaths in consecutive five-year groups starting at the base age.",
      id: "deathsByFiveYearAgeGroup",
      kind: "numberList",
      label: "Deaths",
    },
    {
      description: "Annual intercensal population growth rate.",
      id: "annualGrowthRate",
      kind: "number",
      label: "Growth rate",
    },
    {
      description:
        "Intercensal person-years lived by the population aged base-age and over.",
      id: "personYearsAboveBase",
      kind: "number",
      label: "Person-years",
    },
  ],
  outputs: [
    {
      description:
        "Estimated fraction of adult deaths captured by registration.",
      id: "deathRegistrationCompleteness",
      kind: "number",
      label: "Completeness",
    },
    {
      description:
        "Growth-discounted deaths above the base age before division by person-years.",
      id: "expectedDeathsAboveBase",
      kind: "number",
      label: "Discounted deaths",
    },
  ],
  calculate: (input) =>
    calculateBennettHoriuchiDeathDistributionMethod(
      input as unknown as BennettHoriuchiDeathDistributionMethodInput,
    ),
});

export const runBennettHoriuchiDeathDistributionMethod =
  bennettHoriuchiDeathDistributionMethodTool.execute;
export default bennettHoriuchiDeathDistributionMethodTool;
