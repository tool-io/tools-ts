import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly faceValue: number;
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
    faceValue: { type: "number", minimum: 0 },
    redeemedValue: { type: "number", minimum: 0 },
  },
  required: ["faceValue", "redeemedValue"],
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
/** Subtract explicit redeemed value from voucher face value in the same currency without applying program rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { faceValue, redeemedValue } = request;
  const compute = (): Output => {
    H.domain(faceValue >= 0 && redeemedValue >= 0, "faceValue");
    return {
      remainingValue: faceValue - redeemedValue,
      overRedemption: redeemedValue > faceValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { faceValue: 100, redeemedValue: 35 },
  output: { remainingValue: 65, overRedemption: false },
} satisfies ToolExample<Input, Output>;
export const agriculturalVoucherFaceValueBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["agricultural-policy", "agricultural policy", "agriculture"],
        keywords: ["agricultural policy", "agriculture"],
      },
      id: "agricultural-policy/agricultural-voucher-face-value-balance",
      title: "Agricultural Voucher Face Value Balance",
      description:
        "Subtract explicit redeemed value from voucher face value in the same currency without applying program rules.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          faceValue: { type: "number", minimum: 0 },
          redeemedValue: { type: "number", minimum: 0 },
        },
        required: ["faceValue", "redeemedValue"],
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
            id: "faceValue",
            label: "Face Value",
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
export const run = agriculturalVoucherFaceValueBalanceTool.execute;
export default agriculturalVoucherFaceValueBalanceTool;
