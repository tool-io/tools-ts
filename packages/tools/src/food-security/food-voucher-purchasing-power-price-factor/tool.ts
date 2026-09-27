import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly voucherValue: number;
  readonly oldBasketPrice: number;
  readonly newBasketPrice: number;
};
export type Output = {
  readonly oldBaskets: number;
  readonly newBaskets: number;
  readonly realValueFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voucherValue: { type: "number", minimum: 0 },
    oldBasketPrice: { type: "number", exclusiveMinimum: 0 },
    newBasketPrice: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["voucherValue", "oldBasketPrice", "newBasketPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldBaskets: { type: "number" },
    newBaskets: { type: "number" },
    realValueFactor: { type: "number" },
  },
  required: ["oldBaskets", "newBaskets", "realValueFactor"],
} as const;
/** Calculate food voucher purchasing power price factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { voucherValue, oldBasketPrice, newBasketPrice } = request;
  const compute = (): Output => {
    H.domain(voucherValue >= 0);
    H.positive(oldBasketPrice);
    H.positive(newBasketPrice);
    return {
      oldBaskets: voucherValue / oldBasketPrice,
      newBaskets: voucherValue / newBasketPrice,
      realValueFactor: oldBasketPrice / newBasketPrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { voucherValue: 100, oldBasketPrice: 20, newBasketPrice: 25 },
  output: { oldBaskets: 5, newBaskets: 4, realValueFactor: 0.8 },
} satisfies ToolExample<Input, Output>;
export const foodVoucherPurchasingPowerPriceFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-security/food-voucher-purchasing-power-price-factor",
      title: "Food Voucher Purchasing Power Price Factor Tool",
      description:
        "Calculate food voucher purchasing power price factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          voucherValue: { type: "number", minimum: 0 },
          oldBasketPrice: { type: "number", exclusiveMinimum: 0 },
          newBasketPrice: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["voucherValue", "oldBasketPrice", "newBasketPrice"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          oldBaskets: { type: "number" },
          newBaskets: { type: "number" },
          realValueFactor: { type: "number" },
        },
        required: ["oldBaskets", "newBaskets", "realValueFactor"],
      },
      ports: {
        inputs: [
          {
            id: "voucherValue",
            label: "Voucher Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "oldBasketPrice",
            label: "Old Basket Price",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "newBasketPrice",
            label: "New Basket Price",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "oldBaskets",
            label: "Old Baskets",
            valueType: { type: "number" },
          },
          {
            id: "newBaskets",
            label: "New Baskets",
            valueType: { type: "number" },
          },
          {
            id: "realValueFactor",
            label: "Real Value Factor",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = foodVoucherPurchasingPowerPriceFactorTool.execute;
export default foodVoucherPurchasingPowerPriceFactorTool;
