import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cashWage: number;
  readonly inKindBasketUnits: number;
  readonly basketPrice: number;
};
export type Output = { readonly basketUnits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cashWage: { type: "number" },
    inKindBasketUnits: { type: "number", minimum: 0 },
    basketPrice: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["cashWage", "inKindBasketUnits", "basketPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { basketUnits: { type: "number" } },
  required: ["basketUnits"],
} as const;
/** Wage purchasing power including explicitly valued in-kind basket units in a common currency and period. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cashWage, inKindBasketUnits, basketPrice } = request;
  const compute = (): Output => {
    H.positive(basketPrice);
    H.domain(inKindBasketUnits >= 0);
    return { basketUnits: cashWage / basketPrice + inKindBasketUnits };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cashWage: 12, inKindBasketUnits: 0.5, basketPrice: 4 },
  output: { basketUnits: 3.5 },
} satisfies ToolExample<Input, Output>;
export const historicalWageBasketPurchasingPowerTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "economic-history/historical-wage-basket-purchasing-power-term",
      title: "Historical Wage Basket Purchasing Power Term Tool",
      description:
        "Wage purchasing power including explicitly valued in-kind basket units in a common currency and period.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cashWage: { type: "number" },
          inKindBasketUnits: { type: "number", minimum: 0 },
          basketPrice: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["cashWage", "inKindBasketUnits", "basketPrice"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { basketUnits: { type: "number" } },
        required: ["basketUnits"],
      },
      ports: {
        inputs: [
          {
            id: "cashWage",
            label: "Cash Wage",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inKindBasketUnits",
            label: "In Kind Basket Units",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "basketPrice",
            label: "Basket Price",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "basketUnits",
            label: "Basket Units",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = historicalWageBasketPurchasingPowerTermTool.execute;
export default historicalWageBasketPurchasingPowerTermTool;
