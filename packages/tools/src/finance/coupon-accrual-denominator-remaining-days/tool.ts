import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsedDays: number;
  readonly periodDays: number;
};
export type Output = {
  readonly accruedFraction: number;
  readonly remainingDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedDays: { type: "number", minimum: 0 },
    periodDays: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["elapsedDays", "periodDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accruedFraction: { type: "number" },
    remainingDays: { type: "number" },
  },
  required: ["accruedFraction", "remainingDays"],
} as const;
/** Normalize an explicit accrued-day count to a supplied coupon-period denominator without selecting a bond day-count convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsedDays, periodDays } = request;
  const compute = (): Output => {
    (H.domain(periodDays > 0, "periodDays"), periodDays);
    H.domain(elapsedDays >= 0 && elapsedDays <= periodDays, "elapsedDays");
    return {
      accruedFraction: elapsedDays / periodDays,
      remainingDays: periodDays - elapsedDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsedDays: 45, periodDays: 180 },
  output: { accruedFraction: 0.25, remainingDays: 135 },
} satisfies ToolExample<Input, Output>;
export const couponAccrualDenominatorRemainingDaysTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "trading"],
        fields: ["finance", "business and finance"],
        keywords: ["finance", "business and finance"],
      },
      id: "finance/coupon-accrual-denominator-remaining-days",
      title: "Coupon Accrual Denominator Remaining Days",
      description:
        "Normalize an explicit accrued-day count to a supplied coupon-period denominator without selecting a bond day-count convention.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          elapsedDays: { type: "number", minimum: 0 },
          periodDays: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["elapsedDays", "periodDays"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          accruedFraction: { type: "number" },
          remainingDays: { type: "number" },
        },
        required: ["accruedFraction", "remainingDays"],
      },
      ports: {
        inputs: [
          {
            id: "elapsedDays",
            label: "Elapsed Days",
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
        outputs: [
          {
            id: "accruedFraction",
            label: "Accrued Fraction",
            valueType: { type: "number" },
          },
          {
            id: "remainingDays",
            label: "Remaining Days",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = couponAccrualDenominatorRemainingDaysTool.execute;
export default couponAccrualDenominatorRemainingDaysTool;
