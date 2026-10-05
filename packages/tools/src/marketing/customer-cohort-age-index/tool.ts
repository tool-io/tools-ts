import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cohortYear: number;
  readonly cohortMonth: number;
  readonly observationYear: number;
  readonly observationMonth: number;
};
export type Output = { readonly ageMonths: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cohortYear: { type: "integer", minimum: 1, maximum: 9999 },
    cohortMonth: { type: "integer", minimum: 1, maximum: 12 },
    observationYear: { type: "integer", minimum: 1, maximum: 9999 },
    observationMonth: { type: "integer", minimum: 1, maximum: 12 },
  },
  required: [
    "cohortYear",
    "cohortMonth",
    "observationYear",
    "observationMonth",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ageMonths: { type: "integer" } },
  required: ["ageMonths"],
} as const;
/** Index calendar-month customer-cohort age with the acquisition month as zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cohortYear, cohortMonth, observationYear, observationMonth } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(cohortYear) && cohortYear >= 1 && cohortYear <= 9999,
      "cohortYear",
    ),
      cohortYear);
    (H.domain(
      Number.isSafeInteger(observationYear) &&
        observationYear >= 1 &&
        observationYear <= 9999,
      "observationYear",
    ),
      observationYear);
    (H.domain(
      Number.isSafeInteger(cohortMonth) &&
        cohortMonth >= 1 &&
        cohortMonth <= 12,
      "cohortMonth",
    ),
      cohortMonth);
    (H.domain(
      Number.isSafeInteger(observationMonth) &&
        observationMonth >= 1 &&
        observationMonth <= 12,
      "observationMonth",
    ),
      observationMonth);
    const ageMonths =
      (observationYear - cohortYear) * 12 + observationMonth - cohortMonth;
    H.domain(ageMonths >= 0, "");
    return { ageMonths };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cohortYear: 2025,
    cohortMonth: 11,
    observationYear: 2026,
    observationMonth: 2,
  },
  output: { ageMonths: 3 },
} satisfies ToolExample<Input, Output>;
export const customerCohortAgeIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/customer-cohort-age-index",
    title: "Customer Cohort Age Index Tool",
    description:
      "Index calendar-month customer-cohort age with the acquisition month as zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cohortYear: { type: "integer", minimum: 1, maximum: 9999 },
        cohortMonth: { type: "integer", minimum: 1, maximum: 12 },
        observationYear: { type: "integer", minimum: 1, maximum: 9999 },
        observationMonth: { type: "integer", minimum: 1, maximum: 12 },
      },
      required: [
        "cohortYear",
        "cohortMonth",
        "observationYear",
        "observationMonth",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ageMonths: { type: "integer" } },
      required: ["ageMonths"],
    },
    ports: {
      inputs: [
        {
          id: "cohortYear",
          label: "Cohort Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cohortMonth",
          label: "Cohort Month",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observationYear",
          label: "Observation Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observationMonth",
          label: "Observation Month",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "ageMonths",
          label: "Age Months",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = customerCohortAgeIndexTool.execute;
export default customerCohortAgeIndexTool;
