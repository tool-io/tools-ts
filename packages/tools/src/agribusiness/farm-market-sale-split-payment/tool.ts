import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cashPayment: number;
  readonly totalSale: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cashPayment: { type: "number", minimum: 0 },
    totalSale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["cashPayment", "totalSale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate the supplied cash-payment fraction of a farm-market sale and the amount paid by other methods. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cashPayment, totalSale } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(totalSale) && totalSale > 0, "totalSale"),
      totalSale);
    H.domain(cashPayment >= 0 && cashPayment <= totalSale, "cashPayment");
    return {
      fraction: cashPayment / totalSale,
      remainder: totalSale - cashPayment,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cashPayment: 30, totalSale: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const farmMarketSaleSplitPaymentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agribusiness", "agriculture"],
      keywords: ["agribusiness", "agriculture"],
    },
    id: "agribusiness/farm-market-sale-split-payment",
    title: "Farm Market Sale Split Payment",
    description:
      "Calculate the supplied cash-payment fraction of a farm-market sale and the amount paid by other methods.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cashPayment: { type: "number", minimum: 0 },
        totalSale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["cashPayment", "totalSale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "cashPayment",
          label: "Cash Payment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalSale",
          label: "Total Sale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmMarketSaleSplitPaymentTool.execute;
export default farmMarketSaleSplitPaymentTool;
