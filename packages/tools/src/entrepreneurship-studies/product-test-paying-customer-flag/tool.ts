import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amountPaid: number;
  readonly refundedAmount: number;
  readonly paymentSettled: boolean;
};
export type Output = {
  readonly netPaid: number;
  readonly countedAsPaying: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amountPaid: { type: "number", minimum: 0 },
    refundedAmount: { type: "number", minimum: 0 },
    paymentSettled: { type: "boolean" },
  },
  required: ["amountPaid", "refundedAmount", "paymentSettled"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netPaid: { type: "number" },
    countedAsPaying: { type: "boolean" },
  },
  required: ["netPaid", "countedAsPaying"],
} as const;
/** Classify a recorded test purchase as paying only when settled and positive after supplied refunds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amountPaid, refundedAmount, paymentSettled } = request;
  const compute = (): Output => {
    H.domain(
      amountPaid >= 0 && refundedAmount >= 0 && refundedAmount <= amountPaid,
      "amountPaid",
    );
    return {
      netPaid: amountPaid - refundedAmount,
      countedAsPaying: paymentSettled && amountPaid > refundedAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { amountPaid: 30, refundedAmount: 5, paymentSettled: true },
  output: { netPaid: 25, countedAsPaying: true },
} satisfies ToolExample<Input, Output>;
export const productTestPayingCustomerFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "entrepreneurship-studies",
        "entrepreneurship studies",
        "business and finance",
      ],
      keywords: ["entrepreneurship studies", "business and finance"],
    },
    id: "entrepreneurship-studies/product-test-paying-customer-flag",
    title: "Product Test Paying Customer Flag",
    description:
      "Classify a recorded test purchase as paying only when settled and positive after supplied refunds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amountPaid: { type: "number", minimum: 0 },
        refundedAmount: { type: "number", minimum: 0 },
        paymentSettled: { type: "boolean" },
      },
      required: ["amountPaid", "refundedAmount", "paymentSettled"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netPaid: { type: "number" },
        countedAsPaying: { type: "boolean" },
      },
      required: ["netPaid", "countedAsPaying"],
    },
    ports: {
      inputs: [
        {
          id: "amountPaid",
          label: "Amount Paid",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "refundedAmount",
          label: "Refunded Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paymentSettled",
          label: "Payment Settled",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "netPaid", label: "Net Paid", valueType: { type: "number" } },
        {
          id: "countedAsPaying",
          label: "Counted As Paying",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = productTestPayingCustomerFlagTool.execute;
export default productTestPayingCustomerFlagTool;
