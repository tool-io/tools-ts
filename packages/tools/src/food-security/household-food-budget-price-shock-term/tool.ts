import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantities: readonly number[];
  readonly prices: readonly number[];
  readonly priceChanges: readonly number[];
  readonly budget: number;
};
export type Output = {
  readonly baselineCost: number;
  readonly shockedCost: number;
  readonly budgetGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantities: { type: "array", maxItems: 256, items: { type: "number" } },
    prices: { type: "array", maxItems: 256, items: { type: "number" } },
    priceChanges: { type: "array", maxItems: 256, items: { type: "number" } },
    budget: { type: "number", minimum: 0 },
  },
  required: ["quantities", "prices", "priceChanges", "budget"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselineCost: { type: "number" },
    shockedCost: { type: "number" },
    budgetGap: { type: "number" },
  },
  required: ["baselineCost", "shockedCost", "budgetGap"],
} as const;
/** Calculate household food budget price shock term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantities, prices, priceChanges, budget } = request;
  const compute = (): Output => {
    H.sameLength(quantities, prices);
    H.sameLength(quantities, priceChanges);
    H.domain(
      quantities.every((x) => x >= 0) &&
        prices.every((x) => x >= 0) &&
        priceChanges.every((x) => x >= -1) &&
        budget >= 0,
    );
    return {
      baselineCost: H.dot(quantities, prices),
      shockedCost: quantities.reduce(
        (s, q, i) => s + q * prices[i] * (1 + priceChanges[i]),
        0,
      ),
      budgetGap:
        budget -
        quantities.reduce(
          (s, q, i) => s + q * prices[i] * (1 + priceChanges[i]),
          0,
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    quantities: [2, 3],
    prices: [10, 20],
    priceChanges: [0.1, 0],
    budget: 100,
  },
  output: { baselineCost: 80, shockedCost: 82, budgetGap: 18 },
} satisfies ToolExample<Input, Output>;
export const householdFoodBudgetPriceShockTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-security/household-food-budget-price-shock-term",
    title: "Household Food Budget Price Shock Term Tool",
    description:
      "Calculate household food budget price shock term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantities: { type: "array", maxItems: 256, items: { type: "number" } },
        prices: { type: "array", maxItems: 256, items: { type: "number" } },
        priceChanges: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        budget: { type: "number", minimum: 0 },
      },
      required: ["quantities", "prices", "priceChanges", "budget"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baselineCost: { type: "number" },
        shockedCost: { type: "number" },
        budgetGap: { type: "number" },
      },
      required: ["baselineCost", "shockedCost", "budgetGap"],
    },
    ports: {
      inputs: [
        {
          id: "quantities",
          label: "Quantities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "prices",
          label: "Prices",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "priceChanges",
          label: "Price Changes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "budget",
          label: "Budget",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "baselineCost",
          label: "Baseline Cost",
          valueType: { type: "number" },
        },
        {
          id: "shockedCost",
          label: "Shocked Cost",
          valueType: { type: "number" },
        },
        { id: "budgetGap", label: "Budget Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = householdFoodBudgetPriceShockTermTool.execute;
export default householdFoodBudgetPriceShockTermTool;
