import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeadshipRateHouseholdProjectionInput = {
  readonly headshipRatesByAge: readonly number[];
  readonly adultPopulationByAge: readonly number[];
};

export type HeadshipRateHouseholdProjectionOutput = {
  readonly projectedHouseholds: number;
  readonly totalAdultPopulation: number;
};

export const calculateHeadshipRateHouseholdProjection = (
  input: HeadshipRateHouseholdProjectionInput,
): HeadshipRateHouseholdProjectionOutput => {
  if (input.headshipRatesByAge.length === 0)
    simpleError(
      "headshipRatesByAge",
      "Provide at least one headship rate.",
      "invalid_list",
    );
  for (const rate of input.headshipRatesByAge)
    if (!(
      typeof rate === "number" &&
      Number.isFinite(rate) &&
      rate >= 0 &&
      rate <= 1
    ))
      simpleError(
        "headshipRatesByAge",
        "Headship rates must lie between zero and one.",
        "invalid_list",
      );
  if (input.adultPopulationByAge.length !== input.headshipRatesByAge.length)
    simpleError(
      "adultPopulationByAge",
      "Adult population counts must match the headship rates one to one.",
      "invalid_list",
    );
  let projectedHouseholds = 0;
  let totalAdultPopulation = 0;
  for (let i = 0; i < input.headshipRatesByAge.length; i += 1) {
    const population = input.adultPopulationByAge[i]!;
    if (!(
      typeof population === "number" &&
      Number.isFinite(population) &&
      population >= 0
    ))
      simpleError(
        "adultPopulationByAge",
        "Adult population counts must be finite and non-negative.",
        "invalid_list",
      );
    projectedHouseholds += input.headshipRatesByAge[i]! * population;
    totalAdultPopulation += population;
  }
  return { projectedHouseholds, totalAdultPopulation };
};

export const headshipRateHouseholdProjectionExample = {
  input: {
    headshipRatesByAge: [0.5, 0.3, 0.1],
    adultPopulationByAge: [200, 400, 400],
  },
  output: {
    projectedHouseholds: 260,
    totalAdultPopulation: 1000,
  },
} satisfies ToolExample<
  HeadshipRateHouseholdProjectionInput,
  HeadshipRateHouseholdProjectionOutput
>;

export const headshipRateHouseholdProjectionTool = createSimpleTool({
  id: "demography/headship-rate-household-projection",
  title: "Headship Rate Household Projection",
  description:
    "Project the number of households with the headship-rate method: multiply each age group's adult population by its age-specific headship rate and sum across groups.",
  inputs: [
    {
      description:
        "Age-specific headship rates as proportions from zero to one.",
      id: "headshipRatesByAge",
      kind: "numberList",
      label: "Headship rates",
    },
    {
      description: "Projected adult population for the same age groups.",
      id: "adultPopulationByAge",
      kind: "numberList",
      label: "Adults",
    },
  ],
  outputs: [
    {
      description: "Projected number of households.",
      id: "projectedHouseholds",
      kind: "number",
      label: "Households",
    },
    {
      description: "Total adult population covered by the projection.",
      id: "totalAdultPopulation",
      kind: "number",
      label: "Total adults",
    },
  ],
  calculate: (input) =>
    calculateHeadshipRateHouseholdProjection(
      input as unknown as HeadshipRateHouseholdProjectionInput,
    ),
});

export const runHeadshipRateHouseholdProjection =
  headshipRateHouseholdProjectionTool.execute;
export default headshipRateHouseholdProjectionTool;
