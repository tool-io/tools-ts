import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issuedValue: number;
  readonly redeemedValue: number;
  readonly transferredOutValue: number;
};
export type Output = { readonly remainingValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issuedValue: { type: "number", minimum: 0 },
    redeemedValue: { type: "number", minimum: 0 },
    transferredOutValue: { type: "number", minimum: 0 },
  },
  required: ["issuedValue", "redeemedValue", "transferredOutValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingValue: { type: "number" } },
  required: ["remainingValue"],
} as const;
/** Reconcile explicit voucher issue, redemption, and outward transfer values in the same currency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issuedValue, redeemedValue, transferredOutValue } = request;
  const compute = (): Output => {
    H.domain(
      issuedValue >= 0 && redeemedValue >= 0 && transferredOutValue >= 0,
      "issuedValue",
    );
    return {
      remainingValue: issuedValue - redeemedValue - transferredOutValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issuedValue: 100, redeemedValue: 35, transferredOutValue: 20 },
  output: { remainingValue: 45 },
} satisfies ToolExample<Input, Output>;
export const foodVoucherRedemptionBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["food-security", "food security", "agriculture"],
      keywords: ["food security", "agriculture"],
    },
    id: "food-security/food-voucher-redemption-balance",
    title: "Food Voucher Redemption Balance",
    description:
      "Reconcile explicit voucher issue, redemption, and outward transfer values in the same currency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        issuedValue: { type: "number", minimum: 0 },
        redeemedValue: { type: "number", minimum: 0 },
        transferredOutValue: { type: "number", minimum: 0 },
      },
      required: ["issuedValue", "redeemedValue", "transferredOutValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainingValue: { type: "number" } },
      required: ["remainingValue"],
    },
    ports: {
      inputs: [
        {
          id: "issuedValue",
          label: "Issued Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "redeemedValue",
          label: "Redeemed Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transferredOutValue",
          label: "Transferred Out Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingValue",
          label: "Remaining Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodVoucherRedemptionBalanceTool.execute;
export default foodVoucherRedemptionBalanceTool;
