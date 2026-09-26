import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly price: number;
  readonly quantity: number;
  readonly priceDerivative: number;
};
export type Output = {
  readonly marginalExpenditure: number;
  readonly wedge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    price: { type: "number" },
    quantity: { type: "number", minimum: 0 },
    priceDerivative: { type: "number" },
  },
  required: ["price", "quantity", "priceDerivative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marginalExpenditure: { type: "number" },
    wedge: { type: "number" },
  },
  required: ["marginalExpenditure", "wedge"],
} as const;
/** Differentiate expenditure q*p(q) at supplied local price and derivative. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { price, quantity, priceDerivative } = request;
  const compute = (): Output => {
    H.domain(quantity >= 0);
    return {
      marginalExpenditure: price + quantity * priceDerivative,
      wedge: quantity * priceDerivative,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { price: 10, quantity: 5, priceDerivative: 2 },
  output: { marginalExpenditure: 20, wedge: 10 },
} satisfies ToolExample<Input, Output>;
export const marginalExpenditureWedgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/marginal-expenditure-wedge",
    title: "Marginal Expenditure Wedge Tool",
    description:
      "Differentiate expenditure q*p(q) at supplied local price and derivative.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        price: { type: "number" },
        quantity: { type: "number", minimum: 0 },
        priceDerivative: { type: "number" },
      },
      required: ["price", "quantity", "priceDerivative"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marginalExpenditure: { type: "number" },
        wedge: { type: "number" },
      },
      required: ["marginalExpenditure", "wedge"],
    },
    ports: {
      inputs: [
        {
          id: "price",
          label: "Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "priceDerivative",
          label: "Price Derivative",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "marginalExpenditure",
          label: "Marginal Expenditure",
          valueType: { type: "number" },
        },
        { id: "wedge", label: "Wedge", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = marginalExpenditureWedgeTool.execute;
export default marginalExpenditureWedgeTool;
