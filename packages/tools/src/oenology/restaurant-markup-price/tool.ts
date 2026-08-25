import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type RestaurantMarkupPriceInput = {
  readonly wholesaleCost: number;
  readonly markupMultiple?: number;
};

export type RestaurantMarkupPriceOutput = {
  readonly listPrice: number;
};

export const restaurantMarkupPriceExample = {
  input: {
    markupMultiple: 2.5,
    wholesaleCost: 12,
  },
  output: {
    listPrice: 30,
  },
} satisfies ToolExample<
  RestaurantMarkupPriceInput,
  RestaurantMarkupPriceOutput
>;

export const calculateRestaurantMarkupPrice = (
  input: RestaurantMarkupPriceInput,
): RestaurantMarkupPriceOutput => {
  const multiple = input.markupMultiple ?? 3;
  if (multiple < 0)
    simpleError(
      "markupMultiple",
      "The markup multiple cannot be negative.",
      "invalid_value",
    );
  if (input.wholesaleCost < 0)
    simpleError(
      "wholesaleCost",
      "Wholesale cost cannot be negative.",
      "invalid_value",
    );
  return {
    listPrice: roundStatistic(input.wholesaleCost * multiple),
  };
};

export const restaurantMarkupPriceTool = createSimpleTool({
  calculate: (input) =>
    calculateRestaurantMarkupPrice(
      input as unknown as RestaurantMarkupPriceInput,
    ),
  description:
    "Apply the house markup multiple to a bottle's wholesale cost for the wine list price.",
  id: "oenology/restaurant-markup-price",
  inputs: [
    {
      default: 3,
      description:
        "Menu markup over wholesale; three times is a common restaurant default.",
      id: "markupMultiple",
      kind: "number",
      label: "Markup multiple",
      minimum: 0,
    },
    {
      description: "Wholesale cost of the bottle.",
      id: "wholesaleCost",
      kind: "number",
      label: "Wholesale cost",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Price to print on the wine list.",
      id: "listPrice",
      kind: "number",
      label: "List price",
    },
  ],
  title: "Restaurant Markup Price Calculator",
});
export const runRestaurantMarkupPrice = restaurantMarkupPriceTool.execute;
export default restaurantMarkupPriceTool;
