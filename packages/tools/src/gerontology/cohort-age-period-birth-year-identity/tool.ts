import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly periodYear: number;
  readonly ageYears: number;
  readonly recordedBirthYear: number;
};
export type Output = {
  readonly impliedBirthYear: number;
  readonly identityResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    periodYear: { type: "number" },
    ageYears: { type: "number", minimum: 0 },
    recordedBirthYear: { type: "number" },
  },
  required: ["periodYear", "ageYears", "recordedBirthYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    impliedBirthYear: { type: "number" },
    identityResidual: { type: "number" },
  },
  required: ["impliedBirthYear", "identityResidual"],
} as const;
/** Age-period-cohort arithmetic in a consistent continuous-year convention; birthday-related integer rounding is not inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { periodYear, ageYears, recordedBirthYear } = request;
  const compute = (): Output => {
    H.domain(ageYears >= 0);
    return {
      impliedBirthYear: periodYear - ageYears,
      identityResidual: periodYear - ageYears - recordedBirthYear,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { periodYear: 2026, ageYears: 70, recordedBirthYear: 1955 },
  output: { impliedBirthYear: 1956, identityResidual: 1 },
} satisfies ToolExample<Input, Output>;
export const cohortAgePeriodBirthYearIdentityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/cohort-age-period-birth-year-identity",
    title: "Cohort Age Period Birth Year Identity Tool",
    description:
      "Age-period-cohort arithmetic in a consistent continuous-year convention; birthday-related integer rounding is not inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        periodYear: { type: "number" },
        ageYears: { type: "number", minimum: 0 },
        recordedBirthYear: { type: "number" },
      },
      required: ["periodYear", "ageYears", "recordedBirthYear"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        impliedBirthYear: { type: "number" },
        identityResidual: { type: "number" },
      },
      required: ["impliedBirthYear", "identityResidual"],
    },
    ports: {
      inputs: [
        {
          id: "periodYear",
          label: "Period Year",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ageYears",
          label: "Age Years",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedBirthYear",
          label: "Recorded Birth Year",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "impliedBirthYear",
          label: "Implied Birth Year",
          valueType: { type: "number" },
        },
        {
          id: "identityResidual",
          label: "Identity Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cohortAgePeriodBirthYearIdentityTool.execute;
export default cohortAgePeriodBirthYearIdentityTool;
