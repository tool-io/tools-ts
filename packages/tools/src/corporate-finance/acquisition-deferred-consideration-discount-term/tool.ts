import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly futurePayment: number;
  readonly perPeriodDiscountRate: number;
  readonly periods: number;
};
export type Output = {
  readonly presentValue: number;
  readonly discountAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    futurePayment: { type: "number", minimum: 0 },
    perPeriodDiscountRate: { type: "number", exclusiveMinimum: -1 },
    periods: { type: "number", minimum: 0 },
  },
  required: ["futurePayment", "perPeriodDiscountRate", "periods"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presentValue: { type: "number" },
    discountAmount: { type: "number" },
  },
  required: ["presentValue", "discountAmount"],
} as const;
/** Discount explicit deferred consideration using a supplied per-period rate and horizon without valuation or accounting judgments. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { futurePayment, perPeriodDiscountRate, periods } = request;
  const compute = (): Output => {
    H.domain(futurePayment >= 0, "futurePayment");
    H.domain(perPeriodDiscountRate > -1, "perPeriodDiscountRate");
    H.domain(periods >= 0, "periods");
    return (() => {
      const presentValue =
        futurePayment / Math.pow(1 + perPeriodDiscountRate, periods);
      return { presentValue, discountAmount: futurePayment - presentValue };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { futurePayment: 121, perPeriodDiscountRate: 0.1, periods: 2 },
  output: {
    presentValue: 99.99999999999999,
    discountAmount: 21.000000000000014,
  },
} satisfies ToolExample<Input, Output>;
export const acquisitionDeferredConsiderationDiscountTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "trading"],
        fields: [
          "corporate-finance",
          "corporate finance",
          "business and finance",
        ],
        keywords: ["corporate finance", "business and finance"],
      },
      id: "corporate-finance/acquisition-deferred-consideration-discount-term",
      title: "Acquisition Deferred Consideration Discount Term",
      description:
        "Discount explicit deferred consideration using a supplied per-period rate and horizon without valuation or accounting judgments.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          futurePayment: { type: "number", minimum: 0 },
          perPeriodDiscountRate: { type: "number", exclusiveMinimum: -1 },
          periods: { type: "number", minimum: 0 },
        },
        required: ["futurePayment", "perPeriodDiscountRate", "periods"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          presentValue: { type: "number" },
          discountAmount: { type: "number" },
        },
        required: ["presentValue", "discountAmount"],
      },
      ports: {
        inputs: [
          {
            id: "futurePayment",
            label: "Future Payment",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "perPeriodDiscountRate",
            label: "Per Period Discount Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "periods",
            label: "Periods",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "presentValue",
            label: "Present Value",
            valueType: { type: "number" },
          },
          {
            id: "discountAmount",
            label: "Discount Amount",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = acquisitionDeferredConsiderationDiscountTermTool.execute;
export default acquisitionDeferredConsiderationDiscountTermTool;
