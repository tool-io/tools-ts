import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly purchases: number;
  readonly lowerBound: number;
  readonly upperBound: number;
  readonly rebateRate: number;
};
export type Output = {
  readonly eligibleSlice: number;
  readonly rebate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purchases: { type: "number", minimum: 0 },
    lowerBound: { type: "number", minimum: 0 },
    upperBound: { type: "number" },
    rebateRate: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["purchases", "lowerBound", "upperBound", "rebateRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eligibleSlice: { type: "number" }, rebate: { type: "number" } },
  required: ["eligibleSlice", "rebate"],
} as const;
/** Apply a marginal rebate to the supplied purchase band only, without a retroactive all-purchase rebate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { purchases, lowerBound, upperBound, rebateRate } = request;
  const compute = (): Output => {
    H.domain(purchases >= 0 && lowerBound >= 0 && upperBound >= lowerBound);
    H.probability(rebateRate);
    return {
      eligibleSlice: Math.max(0, Math.min(purchases, upperBound) - lowerBound),
      rebate:
        Math.max(0, Math.min(purchases, upperBound) - lowerBound) * rebateRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    purchases: 1500,
    lowerBound: 1000,
    upperBound: 2000,
    rebateRate: 0.1,
  },
  output: { eligibleSlice: 500, rebate: 50 },
} satisfies ToolExample<Input, Output>;
export const vendorRebatePurchaseTierSliceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/vendor-rebate-purchase-tier-slice",
    title: "Vendor Rebate Purchase Tier Slice Tool",
    description:
      "Apply a marginal rebate to the supplied purchase band only, without a retroactive all-purchase rebate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        purchases: { type: "number", minimum: 0 },
        lowerBound: { type: "number", minimum: 0 },
        upperBound: { type: "number" },
        rebateRate: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["purchases", "lowerBound", "upperBound", "rebateRate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleSlice: { type: "number" },
        rebate: { type: "number" },
      },
      required: ["eligibleSlice", "rebate"],
    },
    ports: {
      inputs: [
        {
          id: "purchases",
          label: "Purchases",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerBound",
          label: "Lower Bound",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperBound",
          label: "Upper Bound",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rebateRate",
          label: "Rebate Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleSlice",
          label: "Eligible Slice",
          valueType: { type: "number" },
        },
        { id: "rebate", label: "Rebate", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = vendorRebatePurchaseTierSliceTool.execute;
export default vendorRebatePurchaseTierSliceTool;
