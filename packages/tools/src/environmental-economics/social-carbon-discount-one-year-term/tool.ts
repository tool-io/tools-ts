import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly futureDamage: number;
  readonly discountRate: number;
  readonly years: number;
  readonly baselineYear: number;
};
export type Output = {
  readonly presentValue: number;
  readonly damageYear: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    futureDamage: { type: "number" },
    discountRate: { type: "number", exclusiveMinimum: -1 },
    years: { type: "number", minimum: 0 },
    baselineYear: { type: "integer" },
  },
  required: ["futureDamage", "discountRate", "years", "baselineYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presentValue: { type: "number" },
    damageYear: { type: "number" },
  },
  required: ["presentValue", "damageYear"],
} as const;
/** Discount one supplied damage flow at a constant effective annual rate; this does not estimate the social cost of carbon. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { futureDamage, discountRate, years, baselineYear } = request;
  const compute = (): Output => {
    H.domain(discountRate > -1 && years >= 0);
    return {
      presentValue: futureDamage / (1 + discountRate) ** years,
      damageYear: baselineYear + years,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { futureDamage: 110, discountRate: 0.1, years: 1, baselineYear: 2026 },
  output: { presentValue: 99.99999999999999, damageYear: 2027 },
} satisfies ToolExample<Input, Output>;
export const socialCarbonDiscountOneYearTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/social-carbon-discount-one-year-term",
    title: "Social Carbon Discount One Year Term Tool",
    description:
      "Discount one supplied damage flow at a constant effective annual rate; this does not estimate the social cost of carbon.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        futureDamage: { type: "number" },
        discountRate: { type: "number", exclusiveMinimum: -1 },
        years: { type: "number", minimum: 0 },
        baselineYear: { type: "integer" },
      },
      required: ["futureDamage", "discountRate", "years", "baselineYear"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        presentValue: { type: "number" },
        damageYear: { type: "number" },
      },
      required: ["presentValue", "damageYear"],
    },
    ports: {
      inputs: [
        {
          id: "futureDamage",
          label: "Future Damage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discountRate",
          label: "Discount Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "years",
          label: "Years",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baselineYear",
          label: "Baseline Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "presentValue",
          label: "Present Value",
          valueType: { type: "number" },
        },
        {
          id: "damageYear",
          label: "Damage Year",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = socialCarbonDiscountOneYearTermTool.execute;
export default socialCarbonDiscountOneYearTermTool;
