import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly invoiceAmount: number;
  readonly suppliedDiscountFraction: number;
};
export type Output = {
  readonly discountAmount: number;
  readonly discountedPayment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    invoiceAmount: { type: "number", minimum: 0 },
    suppliedDiscountFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["invoiceAmount", "suppliedDiscountFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    discountAmount: { type: "number" },
    discountedPayment: { type: "number" },
  },
  required: ["discountAmount", "discountedPayment"],
} as const;
/** Apply an explicit early-payment discount fraction without selecting vendor terms or evaluating financing cost. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { invoiceAmount, suppliedDiscountFraction } = request;
  const compute = (): Output => {
    H.domain(invoiceAmount >= 0, "invoiceAmount");
    (H.domain(
      suppliedDiscountFraction >= 0 && suppliedDiscountFraction <= 1,
      "suppliedDiscountFraction",
    ),
      suppliedDiscountFraction);
    return {
      discountAmount: invoiceAmount * suppliedDiscountFraction,
      discountedPayment: invoiceAmount * (1 - suppliedDiscountFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { invoiceAmount: 200, suppliedDiscountFraction: 0.02 },
  output: { discountAmount: 4, discountedPayment: 196 },
} satisfies ToolExample<Input, Output>;
export const vendorPaymentEarlydiscountDifferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "trading"],
        fields: ["finance", "business and finance"],
        keywords: ["finance", "business and finance"],
      },
      id: "finance/vendor-payment-early-discount-difference",
      title: "Vendor Payment Early Discount Difference",
      description:
        "Apply an explicit early-payment discount fraction without selecting vendor terms or evaluating financing cost.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          invoiceAmount: { type: "number", minimum: 0 },
          suppliedDiscountFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["invoiceAmount", "suppliedDiscountFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          discountAmount: { type: "number" },
          discountedPayment: { type: "number" },
        },
        required: ["discountAmount", "discountedPayment"],
      },
      ports: {
        inputs: [
          {
            id: "invoiceAmount",
            label: "Invoice Amount",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedDiscountFraction",
            label: "Supplied Discount Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "discountAmount",
            label: "Discount Amount",
            valueType: { type: "number" },
          },
          {
            id: "discountedPayment",
            label: "Discounted Payment",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = vendorPaymentEarlydiscountDifferenceTool.execute;
export default vendorPaymentEarlydiscountDifferenceTool;
