import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workers: number;
  readonly monthlyWage: number;
  readonly contributionRate: number;
  readonly months: number;
  readonly collectionFraction: number;
};
export type Output = { readonly assessed: number; readonly collected: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workers: { type: "integer", minimum: 0 },
    monthlyWage: { type: "number", minimum: 0 },
    contributionRate: { type: "number", minimum: 0, maximum: 1 },
    months: { type: "integer", minimum: 0 },
    collectionFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "workers",
    "monthlyWage",
    "contributionRate",
    "months",
    "collectionFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { assessed: { type: "number" }, collected: { type: "number" } },
  required: ["assessed", "collected"],
} as const;
/** Calculate cohort pension contribution month term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workers, monthlyWage, contributionRate, months, collectionFraction } =
    request;
  const compute = (): Output => {
    H.integer(workers, 0);
    H.integer(months, 0);
    H.domain(monthlyWage >= 0);
    H.probability(contributionRate);
    H.probability(collectionFraction);
    return {
      assessed: workers * monthlyWage * contributionRate * months,
      collected:
        workers * monthlyWage * contributionRate * months * collectionFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    workers: 100,
    monthlyWage: 2000,
    contributionRate: 0.1,
    months: 12,
    collectionFraction: 0.9,
  },
  output: { assessed: 240000, collected: 216000 },
} satisfies ToolExample<Input, Output>;
export const cohortPensionContributionMonthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/cohort-pension-contribution-month-term",
    title: "Cohort Pension Contribution Month Term Tool",
    description:
      "Calculate cohort pension contribution month term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workers: { type: "integer", minimum: 0 },
        monthlyWage: { type: "number", minimum: 0 },
        contributionRate: { type: "number", minimum: 0, maximum: 1 },
        months: { type: "integer", minimum: 0 },
        collectionFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "workers",
        "monthlyWage",
        "contributionRate",
        "months",
        "collectionFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assessed: { type: "number" },
        collected: { type: "number" },
      },
      required: ["assessed", "collected"],
    },
    ports: {
      inputs: [
        {
          id: "workers",
          label: "Workers",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "monthlyWage",
          label: "Monthly Wage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contributionRate",
          label: "Contribution Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "months",
          label: "Months",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "collectionFraction",
          label: "Collection Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "assessed", label: "Assessed", valueType: { type: "number" } },
        { id: "collected", label: "Collected", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cohortPensionContributionMonthTermTool.execute;
export default cohortPensionContributionMonthTermTool;
