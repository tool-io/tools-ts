import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HousingPriceToIncomeAffordabilityInput = {
  readonly medianHouseholdIncome: number;
  readonly medianHomePrice: number;
};

export type HousingPriceToIncomeAffordabilityOutput = {
  readonly affordableAtThree: boolean;
  readonly priceToIncomeRatio: number;
};

export const housingPriceToIncomeAffordabilityExample = {
  input: {
    medianHouseholdIncome: 80000,
    medianHomePrice: 320000,
  },
  output: {
    affordableAtThree: false,
    priceToIncomeRatio: 4,
  },
} satisfies ToolExample<
  HousingPriceToIncomeAffordabilityInput,
  HousingPriceToIncomeAffordabilityOutput
>;

export const calculateHousingAffordability = (
  input: HousingPriceToIncomeAffordabilityInput,
): HousingPriceToIncomeAffordabilityOutput => {
  if (
    !Number.isFinite(input.medianHouseholdIncome) ||
    input.medianHouseholdIncome <= 0
  )
    simpleError(
      "medianHouseholdIncome",
      "Median income must be positive to form the ratio.",
      "invalid_value",
    );
  if (!Number.isFinite(input.medianHomePrice) || input.medianHomePrice < 0)
    simpleError(
      "medianHomePrice",
      "Median home price must be a finite nonnegative number.",
      "invalid_value",
    );
  const ratio = input.medianHomePrice / input.medianHouseholdIncome;
  return {
    affordableAtThree: ratio <= 3,
    priceToIncomeRatio: ratio,
  };
};

export const housingPriceToIncomeAffordabilityTool = createSimpleTool({
  calculate: (input) =>
    calculateHousingAffordability({
      medianHomePrice: input.medianHomePrice as number,
      medianHouseholdIncome: input.medianHouseholdIncome as number,
    }),
  description:
    "Divide the median home price by median household income and flag ratios above the classic three-times affordability line.",
  id: "sociology/housing-price-to-income-affordability",
  inputs: [
    {
      description: "Median annual household income in the market.",
      id: "medianHouseholdIncome",
      kind: "number",
      label: "Median income",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Median home sale price in the market.",
      id: "medianHomePrice",
      kind: "number",
      label: "Median home price",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Years of gross household income represented by the home price.",
      id: "priceToIncomeRatio",
      kind: "number",
      label: "Price-to-income",
    },
    {
      description: "Whether the ratio sits at or below three.",
      id: "affordableAtThree",
      kind: "boolean",
      label: "Affordable at 3x",
    },
  ],
  title: "House Price-to-Income Affordability Ratio",
});
export const runHousingPriceToIncomeAffordability =
  housingPriceToIncomeAffordabilityTool.execute;
export default housingPriceToIncomeAffordabilityTool;
