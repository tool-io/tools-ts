import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleDays: number;
  readonly periodDays: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleDays: { type: "number", minimum: 0 },
    periodDays: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["eligibleDays", "periodDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Report an explicit coupon-period day-count share without selecting an accrual convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligibleDays, periodDays } = request;
  const compute = (): Output => {
    H.positive(periodDays);
    H.domain(eligibleDays >= 0 && eligibleDays <= periodDays);
    return { share: eligibleDays / periodDays };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eligibleDays: 30, periodDays: 90 },
  output: { share: 0.3333333333333333 },
} satisfies ToolExample<Input, Output>;
export const couponPeriodExposureShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/coupon-period-exposure-share",
    title: "Coupon Period Exposure Share Tool",
    description:
      "Report an explicit coupon-period day-count share without selecting an accrual convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleDays: { type: "number", minimum: 0 },
        periodDays: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["eligibleDays", "periodDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "eligibleDays",
          label: "Eligible Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periodDays",
          label: "Period Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = couponPeriodExposureShareTool.execute;
export default couponPeriodExposureShareTool;
