import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly discountFraction: number;
  readonly periodDays: number;
};
export type Output = {
  readonly periodReturn: number;
  readonly dailyCompoundReturn: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    discountFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    periodDays: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["discountFraction", "periodDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    periodReturn: { type: "number" },
    dailyCompoundReturn: { type: "number" },
  },
  required: ["periodReturn", "dailyCompoundReturn"],
} as const;
/** Compute the supplied early-payment discount’s forgone period return and constant compound daily equivalent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { discountFraction, periodDays } = request;
  const compute = (): Output => {
    H.domain(discountFraction >= 0 && discountFraction < 1);
    H.positive(periodDays);
    return {
      periodReturn: discountFraction / (1 - discountFraction),
      dailyCompoundReturn: Math.expm1(
        -Math.log1p(-discountFraction) / periodDays,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { discountFraction: 0.2, periodDays: 1 },
  output: { periodReturn: 0.25, dailyCompoundReturn: 0.25 },
} satisfies ToolExample<Input, Output>;
export const cashDiscountEffectivePeriodReturnTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/cash-discount-effective-period-return",
    title: "Cash Discount Effective Period Return Tool",
    description:
      "Compute the supplied early-payment discount’s forgone period return and constant compound daily equivalent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        discountFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        periodDays: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["discountFraction", "periodDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        periodReturn: { type: "number" },
        dailyCompoundReturn: { type: "number" },
      },
      required: ["periodReturn", "dailyCompoundReturn"],
    },
    ports: {
      inputs: [
        {
          id: "discountFraction",
          label: "Discount Fraction",
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
          id: "periodReturn",
          label: "Period Return",
          valueType: { type: "number" },
        },
        {
          id: "dailyCompoundReturn",
          label: "Daily Compound Return",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cashDiscountEffectivePeriodReturnTool.execute;
export default cashDiscountEffectivePeriodReturnTool;
