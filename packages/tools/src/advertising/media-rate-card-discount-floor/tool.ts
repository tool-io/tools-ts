import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rateCardAmount: number;
  readonly suppliedDiscountFraction: number;
  readonly minimumAllowedAmount: number;
};
export type Output = {
  readonly discountedAmount: number;
  readonly appliedAmount: number;
  readonly floorAdjustment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rateCardAmount: { type: "number", minimum: 0 },
    suppliedDiscountFraction: { type: "number", minimum: 0, maximum: 1 },
    minimumAllowedAmount: { type: "number", minimum: 0 },
  },
  required: [
    "rateCardAmount",
    "suppliedDiscountFraction",
    "minimumAllowedAmount",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    discountedAmount: { type: "number" },
    appliedAmount: { type: "number" },
    floorAdjustment: { type: "number" },
  },
  required: ["discountedAmount", "appliedAmount", "floorAdjustment"],
} as const;
/** Apply an explicit discount and supplied minimum media price without fetching rate cards or choosing terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rateCardAmount, suppliedDiscountFraction, minimumAllowedAmount } =
    request;
  const compute = (): Output => {
    H.domain(
      rateCardAmount >= 0 && minimumAllowedAmount >= 0,
      "rateCardAmount",
    );
    (H.domain(
      suppliedDiscountFraction >= 0 && suppliedDiscountFraction <= 1,
      "suppliedDiscountFraction",
    ),
      suppliedDiscountFraction);
    return (() => {
      const discountedAmount = rateCardAmount * (1 - suppliedDiscountFraction);
      return {
        discountedAmount,
        appliedAmount: Math.max(minimumAllowedAmount, discountedAmount),
        floorAdjustment: Math.max(0, minimumAllowedAmount - discountedAmount),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rateCardAmount: 100,
    suppliedDiscountFraction: 0.25,
    minimumAllowedAmount: 80,
  },
  output: { discountedAmount: 75, appliedAmount: 80, floorAdjustment: 5 },
} satisfies ToolExample<Input, Output>;
export const mediaRateCardDiscountFloorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["advertising", "business and finance"],
      keywords: ["advertising", "business and finance"],
    },
    id: "advertising/media-rate-card-discount-floor",
    title: "Media Rate Card Discount Floor",
    description:
      "Apply an explicit discount and supplied minimum media price without fetching rate cards or choosing terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rateCardAmount: { type: "number", minimum: 0 },
        suppliedDiscountFraction: { type: "number", minimum: 0, maximum: 1 },
        minimumAllowedAmount: { type: "number", minimum: 0 },
      },
      required: [
        "rateCardAmount",
        "suppliedDiscountFraction",
        "minimumAllowedAmount",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        discountedAmount: { type: "number" },
        appliedAmount: { type: "number" },
        floorAdjustment: { type: "number" },
      },
      required: ["discountedAmount", "appliedAmount", "floorAdjustment"],
    },
    ports: {
      inputs: [
        {
          id: "rateCardAmount",
          label: "Rate Card Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDiscountFraction",
          label: "Supplied Discount Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minimumAllowedAmount",
          label: "Minimum Allowed Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "discountedAmount",
          label: "Discounted Amount",
          valueType: { type: "number" },
        },
        {
          id: "appliedAmount",
          label: "Applied Amount",
          valueType: { type: "number" },
        },
        {
          id: "floorAdjustment",
          label: "Floor Adjustment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mediaRateCardDiscountFloorTool.execute;
export default mediaRateCardDiscountFloorTool;
