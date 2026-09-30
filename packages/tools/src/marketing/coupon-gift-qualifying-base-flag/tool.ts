import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly purchasedValue: number;
  readonly giftValue: number;
  readonly suppliedThreshold: number;
  readonly includeGift: boolean;
};
export type Output = {
  readonly qualifyingBase: number;
  readonly qualifies: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purchasedValue: { type: "number", minimum: 0 },
    giftValue: { type: "number", minimum: 0 },
    suppliedThreshold: { type: "number", minimum: 0 },
    includeGift: { type: "boolean" },
  },
  required: ["purchasedValue", "giftValue", "suppliedThreshold", "includeGift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    qualifyingBase: { type: "number" },
    qualifies: { type: "boolean" },
  },
  required: ["qualifyingBase", "qualifies"],
} as const;
/** Calculate coupon gift qualifying base flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { purchasedValue, giftValue, suppliedThreshold, includeGift } = request;
  const compute = (): Output => {
    H.domain(purchasedValue >= 0 && giftValue >= 0 && suppliedThreshold >= 0);
    return {
      qualifyingBase: purchasedValue + (includeGift ? giftValue : 0),
      qualifies:
        purchasedValue + (includeGift ? giftValue : 0) >= suppliedThreshold,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    purchasedValue: 80,
    giftValue: 30,
    suppliedThreshold: 100,
    includeGift: false,
  },
  output: { qualifyingBase: 80, qualifies: false },
} satisfies ToolExample<Input, Output>;
export const couponGiftQualifyingBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/coupon-gift-qualifying-base-flag",
    title: "Coupon Gift Qualifying Base Flag Tool",
    description:
      "Calculate coupon gift qualifying base flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        purchasedValue: { type: "number", minimum: 0 },
        giftValue: { type: "number", minimum: 0 },
        suppliedThreshold: { type: "number", minimum: 0 },
        includeGift: { type: "boolean" },
      },
      required: [
        "purchasedValue",
        "giftValue",
        "suppliedThreshold",
        "includeGift",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        qualifyingBase: { type: "number" },
        qualifies: { type: "boolean" },
      },
      required: ["qualifyingBase", "qualifies"],
    },
    ports: {
      inputs: [
        {
          id: "purchasedValue",
          label: "Purchased Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "giftValue",
          label: "Gift Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedThreshold",
          label: "Supplied Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeGift",
          label: "Include Gift",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "qualifyingBase",
          label: "Qualifying Base",
          valueType: { type: "number" },
        },
        { id: "qualifies", label: "Qualifies", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = couponGiftQualifyingBaseFlagTool.execute;
export default couponGiftQualifyingBaseFlagTool;
