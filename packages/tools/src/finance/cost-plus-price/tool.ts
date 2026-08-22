import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const costPlusPriceTool = createSimpleTool({
  id: "finance/cost-plus-price",
  title: "Cost Plus Price Calculator",
  description:
    "Calculate a sale price by applying a markup percentage to a unit cost.",
  inputs: [
    { id: "cost", label: "Unit cost", kind: "number", minimum: 0 },
    {
      id: "markupPercent",
      label: "Markup",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [{ id: "price", label: "Price", kind: "number" }],
  calculate: (input) => {
    return {
      price:
        (input.cost as number) * (1 + (input.markupPercent as number) / 100),
    };
  },
});
export const runCostPlusPrice = costPlusPriceTool.execute;
export default costPlusPriceTool;

export type CostPlusPriceInput = {
  readonly cost: number;
  readonly markupPercent: number;
};

export type CostPlusPriceOutput = {
  readonly price: number;
};

export const costPlusPriceExample = {
  input: { cost: 80, markupPercent: 25 },
  output: { price: 100 },
} satisfies ToolExample<CostPlusPriceInput, CostPlusPriceOutput>;
