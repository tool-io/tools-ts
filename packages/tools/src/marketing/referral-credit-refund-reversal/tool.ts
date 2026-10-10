import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly creditedAmount: number;
  readonly refundedPurchaseAmount: number;
  readonly suppliedCreditRate: number;
};
export type Output = {
  readonly reversedCredit: number;
  readonly remainingCredit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creditedAmount: { type: "number", minimum: 0 },
    refundedPurchaseAmount: { type: "number", minimum: 0 },
    suppliedCreditRate: { type: "number", minimum: 0 },
  },
  required: ["creditedAmount", "refundedPurchaseAmount", "suppliedCreditRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reversedCredit: { type: "number" },
    remainingCredit: { type: "number" },
  },
  required: ["reversedCredit", "remainingCredit"],
} as const;
/** Apply an explicit credit reversal rate to a refunded purchase amount without choosing referral terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { creditedAmount, refundedPurchaseAmount, suppliedCreditRate } =
    request;
  const compute = (): Output => {
    H.domain(
      creditedAmount >= 0 && refundedPurchaseAmount >= 0,
      "creditedAmount",
    );
    H.domain(suppliedCreditRate >= 0, "suppliedCreditRate");
    return {
      reversedCredit: refundedPurchaseAmount * suppliedCreditRate,
      remainingCredit:
        creditedAmount - refundedPurchaseAmount * suppliedCreditRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    creditedAmount: 20,
    refundedPurchaseAmount: 50,
    suppliedCreditRate: 0.1,
  },
  output: { reversedCredit: 5, remainingCredit: 15 },
} satisfies ToolExample<Input, Output>;
export const referralCreditRefundReversalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["marketing", "business and finance"],
      keywords: ["marketing", "business and finance"],
    },
    id: "marketing/referral-credit-refund-reversal",
    title: "Referral Credit Refund Reversal",
    description:
      "Apply an explicit credit reversal rate to a refunded purchase amount without choosing referral terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        creditedAmount: { type: "number", minimum: 0 },
        refundedPurchaseAmount: { type: "number", minimum: 0 },
        suppliedCreditRate: { type: "number", minimum: 0 },
      },
      required: [
        "creditedAmount",
        "refundedPurchaseAmount",
        "suppliedCreditRate",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reversedCredit: { type: "number" },
        remainingCredit: { type: "number" },
      },
      required: ["reversedCredit", "remainingCredit"],
    },
    ports: {
      inputs: [
        {
          id: "creditedAmount",
          label: "Credited Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "refundedPurchaseAmount",
          label: "Refunded Purchase Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCreditRate",
          label: "Supplied Credit Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "reversedCredit",
          label: "Reversed Credit",
          valueType: { type: "number" },
        },
        {
          id: "remainingCredit",
          label: "Remaining Credit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = referralCreditRefundReversalTool.execute;
export default referralCreditRefundReversalTool;
