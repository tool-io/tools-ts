import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ageGroupPopulation: number;
  readonly meanTaxPerPerson: number;
};
export type Output = { readonly taxContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageGroupPopulation: { type: "number", minimum: 0 },
    meanTaxPerPerson: { type: "number" },
  },
  required: ["ageGroupPopulation", "meanTaxPerPerson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { taxContribution: { type: "number" } },
  required: ["taxContribution"],
} as const;
/** Multiply supplied age-group population by signed mean tax per person without projecting tax policy or behavior. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ageGroupPopulation, meanTaxPerPerson } = request;
  const compute = (): Output => {
    H.domain(ageGroupPopulation >= 0, "ageGroupPopulation");
    return { taxContribution: ageGroupPopulation * meanTaxPerPerson };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ageGroupPopulation: 100, meanTaxPerPerson: 20 },
  output: { taxContribution: 2000 },
} satisfies ToolExample<Input, Output>;
export const ageSpecificTaxContributionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/age-specific-tax-contribution-term",
    title: "Age Specific Tax Contribution Term Tool",
    description:
      "Multiply supplied age-group population by signed mean tax per person without projecting tax policy or behavior.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageGroupPopulation: { type: "number", minimum: 0 },
        meanTaxPerPerson: { type: "number" },
      },
      required: ["ageGroupPopulation", "meanTaxPerPerson"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { taxContribution: { type: "number" } },
      required: ["taxContribution"],
    },
    ports: {
      inputs: [
        {
          id: "ageGroupPopulation",
          label: "Age Group Population",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "meanTaxPerPerson",
          label: "Mean Tax Per Person",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "taxContribution",
          label: "Tax Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ageSpecificTaxContributionTermTool.execute;
export default ageSpecificTaxContributionTermTool;
