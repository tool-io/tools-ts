import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cost: number;
  readonly annualRate: number;
  readonly year: number;
};
export type Output = {
  readonly discountFactor: number;
  readonly presentCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cost: { type: "number" },
    annualRate: { type: "number", exclusiveMinimum: -1 },
    year: { type: "integer", minimum: 0 },
  },
  required: ["cost", "annualRate", "year"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    discountFactor: { type: "number" },
    presentCost: { type: "number" },
  },
  required: ["discountFactor", "presentCost"],
} as const;
/** Calculate policy discounted one year cost from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cost, annualRate, year } = request;
  const compute = (): Output => {
    H.domain(annualRate > -1);
    H.integer(year, 0);
    return {
      discountFactor: (1 + annualRate) ** -year,
      presentCost: cost / (1 + annualRate) ** year,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cost: 110, annualRate: 0.1, year: 1 },
  output: {
    discountFactor: 0.9090909090909091,
    presentCost: 99.99999999999999,
  },
} satisfies ToolExample<Input, Output>;
export const policyDiscountedOneYearCostTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/policy-discounted-one-year-cost",
    title: "Policy Discounted One Year Cost Tool",
    description:
      "Calculate policy discounted one year cost from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cost: { type: "number" },
        annualRate: { type: "number", exclusiveMinimum: -1 },
        year: { type: "integer", minimum: 0 },
      },
      required: ["cost", "annualRate", "year"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        discountFactor: { type: "number" },
        presentCost: { type: "number" },
      },
      required: ["discountFactor", "presentCost"],
    },
    ports: {
      inputs: [
        {
          id: "cost",
          label: "Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "annualRate",
          label: "Annual Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "year",
          label: "Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "discountFactor",
          label: "Discount Factor",
          valueType: { type: "number" },
        },
        {
          id: "presentCost",
          label: "Present Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = policyDiscountedOneYearCostTool.execute;
export default policyDiscountedOneYearCostTool;
