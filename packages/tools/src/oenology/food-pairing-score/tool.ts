import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type FoodPairingScoreInput = {
  readonly foodAttributes: number;
  readonly sharedAttributes: number;
  readonly wineAttributes: number;
};

export type FoodPairingScoreOutput = {
  readonly matchPercent: number;
};

export const foodPairingScoreExample = {
  input: {
    foodAttributes: 4,
    sharedAttributes: 2,
    wineAttributes: 4,
  },
  output: {
    matchPercent: 33.3333333333,
  },
} satisfies ToolExample<FoodPairingScoreInput, FoodPairingScoreOutput>;

export const calculateFoodPairingScore = (
  input: FoodPairingScoreInput,
): FoodPairingScoreOutput => {
  if (input.wineAttributes <= 0)
    simpleError(
      "wineAttributes",
      "The wine attribute count must be positive to score a match.",
      "invalid_value",
    );
  if (
    input.sharedAttributes > input.wineAttributes ||
    input.sharedAttributes > input.foodAttributes
  )
    simpleError(
      "sharedAttributes",
      "Shared attributes cannot exceed either profile's attribute count.",
      "invalid_value",
    );
  return {
    matchPercent: roundStatistic(
      (input.sharedAttributes /
        (input.wineAttributes +
          input.foodAttributes -
          input.sharedAttributes)) *
        100,
    ),
  };
};

export const foodPairingScoreTool = createSimpleTool({
  calculate: (input) =>
    calculateFoodPairingScore(input as unknown as FoodPairingScoreInput),
  description:
    "Calculate Jaccard similarity between food and wine attribute sets: shared attributes divided by all distinct attributes across both profiles.",
  id: "oenology/food-pairing-score",
  inputs: [
    {
      description: "Total distinct attributes recorded for the food.",
      id: "foodAttributes",
      kind: "integer",
      label: "Food attributes",
      minimum: 1,
    },
    {
      description: "Number of attributes the dish and wine share.",
      id: "sharedAttributes",
      kind: "integer",
      label: "Shared attributes",
      minimum: 0,
    },
    {
      description: "Total profile attributes counted for the wine.",
      id: "wineAttributes",
      kind: "integer",
      label: "Wine attributes",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Jaccard similarity of the two attribute sets.",
      id: "matchPercent",
      kind: "number",
      label: "Match score",
      unit: "%",
    },
  ],
  title: "Food Pairing Match Score Calculator",
});
export const runFoodPairingScore = foodPairingScoreTool.execute;
export default foodPairingScoreTool;
