import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly annualRate: number; readonly years: number };
export type Output = { readonly discountFactor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annualRate: { type: "number", exclusiveMinimum: -1 },
    years: { type: "number", minimum: 0 },
  },
  required: ["annualRate", "years"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { discountFactor: { type: "number" } },
  required: ["discountFactor"],
} as const;
/** Return a discrete annual discount factor for an explicit rate and nonnegative time horizon, allowing rates above -100 percent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { annualRate, years } = request;
  const compute = (): Output => {
    H.domain(annualRate > -1, "annualRate");
    H.domain(years >= 0, "years");
    return { discountFactor: Math.exp(-years * Math.log1p(annualRate)) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { annualRate: 0.1, years: 2 },
  output: { discountFactor: 0.8264462809917356 },
} satisfies ToolExample<Input, Output>;
export const policyBenefitCostDiscountFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/policy-benefit-cost-discount-factor",
    title: "Policy Benefit Cost Discount Factor Tool",
    description:
      "Return a discrete annual discount factor for an explicit rate and nonnegative time horizon, allowing rates above -100 percent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        annualRate: { type: "number", exclusiveMinimum: -1 },
        years: { type: "number", minimum: 0 },
      },
      required: ["annualRate", "years"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { discountFactor: { type: "number" } },
      required: ["discountFactor"],
    },
    ports: {
      inputs: [
        {
          id: "annualRate",
          label: "Annual Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "years",
          label: "Years",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "discountFactor",
          label: "Discount Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = policyBenefitCostDiscountFactorTool.execute;
export default policyBenefitCostDiscountFactorTool;
