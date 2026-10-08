import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cohortPopulation: number;
  readonly ageSpecificPerPersonBudget: number;
};
export type Output = { readonly cohortBudget: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cohortPopulation: { type: "integer", minimum: 0 },
    ageSpecificPerPersonBudget: { type: "number", minimum: 0 },
  },
  required: ["cohortPopulation", "ageSpecificPerPersonBudget"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cohortBudget: { type: "number" } },
  required: ["cohortBudget"],
} as const;
/** Extend an explicit age-cohort population at a supplied per-person budget without estimating age-specific needs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cohortPopulation, ageSpecificPerPersonBudget } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(cohortPopulation) &&
        cohortPopulation >= 0 &&
        cohortPopulation <= Number.MAX_SAFE_INTEGER,
      "cohortPopulation",
    ),
      cohortPopulation);
    H.domain(ageSpecificPerPersonBudget >= 0, "ageSpecificPerPersonBudget");
    return { cohortBudget: cohortPopulation * ageSpecificPerPersonBudget };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cohortPopulation: 1000, ageSpecificPerPersonBudget: 250 },
  output: { cohortBudget: 250000 },
} satisfies ToolExample<Input, Output>;
export const cohortBudgetAgeWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["demographic-economics", "demographic economics", "economics"],
      keywords: ["demographic economics", "economics"],
    },
    id: "demographic-economics/cohort-budget-age-weight",
    title: "Cohort Budget Age Weight",
    description:
      "Extend an explicit age-cohort population at a supplied per-person budget without estimating age-specific needs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cohortPopulation: { type: "integer", minimum: 0 },
        ageSpecificPerPersonBudget: { type: "number", minimum: 0 },
      },
      required: ["cohortPopulation", "ageSpecificPerPersonBudget"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { cohortBudget: { type: "number" } },
      required: ["cohortBudget"],
    },
    ports: {
      inputs: [
        {
          id: "cohortPopulation",
          label: "Cohort Population",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "ageSpecificPerPersonBudget",
          label: "Age Specific Per Person Budget",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "cohortBudget",
          label: "Cohort Budget",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cohortBudgetAgeWeightTool.execute;
export default cohortBudgetAgeWeightTool;
