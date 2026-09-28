import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly surveyYear: number;
  readonly reportedAge: number;
  readonly birthYear: number;
};
export type Output = {
  readonly yearDifference: number;
  readonly ageGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surveyYear: { type: "integer" },
    reportedAge: { type: "integer", minimum: 0 },
    birthYear: { type: "integer" },
  },
  required: ["surveyYear", "reportedAge", "birthYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    yearDifference: { type: "integer" },
    ageGap: { type: "integer" },
  },
  required: ["yearDifference", "ageGap"],
} as const;
/** Year-index comparison only; birthdays within the survey year are not inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surveyYear, reportedAge, birthYear } = request;
  const compute = (): Output => {
    H.integer(reportedAge, 0);
    H.domain(surveyYear >= birthYear);
    return {
      yearDifference: surveyYear - birthYear,
      ageGap: reportedAge - (surveyYear - birthYear),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { surveyYear: 2026, reportedAge: 65, birthYear: 1960 },
  output: { yearDifference: 66, ageGap: -1 },
} satisfies ToolExample<Input, Output>;
export const retirementSurveyAgePeriodGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/retirement-survey-age-period-gap",
    title: "Retirement Survey Age Period Gap Tool",
    description:
      "Year-index comparison only; birthdays within the survey year are not inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surveyYear: { type: "integer" },
        reportedAge: { type: "integer", minimum: 0 },
        birthYear: { type: "integer" },
      },
      required: ["surveyYear", "reportedAge", "birthYear"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        yearDifference: { type: "integer" },
        ageGap: { type: "integer" },
      },
      required: ["yearDifference", "ageGap"],
    },
    ports: {
      inputs: [
        {
          id: "surveyYear",
          label: "Survey Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reportedAge",
          label: "Reported Age",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "birthYear",
          label: "Birth Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "yearDifference",
          label: "Year Difference",
          valueType: { type: "integer" },
        },
        { id: "ageGap", label: "Age Gap", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = retirementSurveyAgePeriodGapTool.execute;
export default retirementSurveyAgePeriodGapTool;
