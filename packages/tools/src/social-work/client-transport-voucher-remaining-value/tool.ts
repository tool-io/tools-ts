import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly voucherValue: number;
  readonly redeemedValue: number;
};
export type Output = {
  readonly remainingValue: number;
  readonly overRedemption: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voucherValue: { type: "number", minimum: 0 },
    redeemedValue: { type: "number", minimum: 0 },
  },
  required: ["voucherValue", "redeemedValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingValue: { type: "number" },
    overRedemption: { type: "boolean" },
  },
  required: ["remainingValue", "overRedemption"],
} as const;
/** Compare explicit transport voucher and redemption values in the same currency without deciding service eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { voucherValue, redeemedValue } = request;
  const compute = (): Output => {
    H.domain(voucherValue >= 0 && redeemedValue >= 0, "voucherValue");
    return {
      remainingValue: voucherValue - redeemedValue,
      overRedemption: redeemedValue > voucherValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { voucherValue: 50, redeemedValue: 18 },
  output: { remainingValue: 32, overRedemption: false },
} satisfies ToolExample<Input, Output>;
export const clientTransportVoucherRemainingValueTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["social-work", "social work", "social sciences"],
        keywords: ["social work", "social sciences"],
      },
      id: "social-work/client-transport-voucher-remaining-value",
      title: "Client Transport Voucher Remaining Value",
      description:
        "Compare explicit transport voucher and redemption values in the same currency without deciding service eligibility.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          voucherValue: { type: "number", minimum: 0 },
          redeemedValue: { type: "number", minimum: 0 },
        },
        required: ["voucherValue", "redeemedValue"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remainingValue: { type: "number" },
          overRedemption: { type: "boolean" },
        },
        required: ["remainingValue", "overRedemption"],
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
            id: "redeemedValue",
            label: "Redeemed Value",
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
          {
            id: "overRedemption",
            label: "Over Redemption",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = clientTransportVoucherRemainingValueTool.execute;
export default clientTransportVoucherRemainingValueTool;
