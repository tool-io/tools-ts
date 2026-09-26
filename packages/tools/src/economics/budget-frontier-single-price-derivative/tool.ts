import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly income: number;
  readonly firstPrice: number;
  readonly secondPrice: number;
  readonly firstQuantity: number;
};
export type Output = {
  readonly secondQuantity: number;
  readonly priceDerivative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    income: { type: "number", minimum: 0 },
    firstPrice: { type: "number", exclusiveMinimum: 0 },
    secondPrice: { type: "number", exclusiveMinimum: 0 },
    firstQuantity: { type: "number", minimum: 0 },
  },
  required: ["income", "firstPrice", "secondPrice", "firstQuantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    secondQuantity: { type: "number" },
    priceDerivative: { type: "number" },
  },
  required: ["secondQuantity", "priceDerivative"],
} as const;
/** Budget frontier and derivative with respect to the first price at fixed supplied first quantity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { income, firstPrice, secondPrice, firstQuantity } = request;
  const compute = (): Output => {
    H.positive(firstPrice);
    H.positive(secondPrice);
    H.domain(income >= 0 && firstQuantity >= 0);
    return {
      secondQuantity: (income - firstPrice * firstQuantity) / secondPrice,
      priceDerivative: -firstQuantity / secondPrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { income: 100, firstPrice: 10, secondPrice: 5, firstQuantity: 3 },
  output: { secondQuantity: 14, priceDerivative: -0.6 },
} satisfies ToolExample<Input, Output>;
export const budgetFrontierSinglePriceDerivativeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "economics/budget-frontier-single-price-derivative",
      title: "Budget Frontier Single Price Derivative Tool",
      description:
        "Budget frontier and derivative with respect to the first price at fixed supplied first quantity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          income: { type: "number", minimum: 0 },
          firstPrice: { type: "number", exclusiveMinimum: 0 },
          secondPrice: { type: "number", exclusiveMinimum: 0 },
          firstQuantity: { type: "number", minimum: 0 },
        },
        required: ["income", "firstPrice", "secondPrice", "firstQuantity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          secondQuantity: { type: "number" },
          priceDerivative: { type: "number" },
        },
        required: ["secondQuantity", "priceDerivative"],
      },
      ports: {
        inputs: [
          {
            id: "income",
            label: "Income",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstPrice",
            label: "First Price",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondPrice",
            label: "Second Price",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstQuantity",
            label: "First Quantity",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "secondQuantity",
            label: "Second Quantity",
            valueType: { type: "number" },
          },
          {
            id: "priceDerivative",
            label: "Price Derivative",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = budgetFrontierSinglePriceDerivativeTool.execute;
export default budgetFrontierSinglePriceDerivativeTool;
