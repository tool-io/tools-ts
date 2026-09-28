import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly birthYear: number;
  readonly originYear: number;
  readonly cohortWidth: number;
};
export type Output = {
  readonly cohortIndex: number;
  readonly lowerYear: number;
  readonly upperYearExclusive: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    birthYear: { type: "integer" },
    originYear: { type: "integer" },
    cohortWidth: { type: "integer", minimum: 1 },
  },
  required: ["birthYear", "originYear", "cohortWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cohortIndex: { type: "integer" },
    lowerYear: { type: "integer" },
    upperYearExclusive: { type: "integer" },
  },
  required: ["cohortIndex", "lowerYear", "upperYearExclusive"],
} as const;
/** Fixed-width birth-year research cohorts relative to an explicit origin; not a statutory pension eligibility rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { birthYear, originYear, cohortWidth } = request;
  const compute = (): Output => {
    H.integer(cohortWidth, 1);
    return {
      cohortIndex: Math.floor((birthYear - originYear) / cohortWidth),
      lowerYear:
        originYear +
        Math.floor((birthYear - originYear) / cohortWidth) * cohortWidth,
      upperYearExclusive:
        originYear +
        (Math.floor((birthYear - originYear) / cohortWidth) + 1) * cohortWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { birthYear: 1958, originYear: 1950, cohortWidth: 5 },
  output: { cohortIndex: 1, lowerYear: 1955, upperYearExclusive: 1960 },
} satisfies ToolExample<Input, Output>;
export const pensionStudyBirthCohortIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/pension-study-birth-cohort-index",
    title: "Pension Study Birth Cohort Index Tool",
    description:
      "Fixed-width birth-year research cohorts relative to an explicit origin; not a statutory pension eligibility rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        birthYear: { type: "integer" },
        originYear: { type: "integer" },
        cohortWidth: { type: "integer", minimum: 1 },
      },
      required: ["birthYear", "originYear", "cohortWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cohortIndex: { type: "integer" },
        lowerYear: { type: "integer" },
        upperYearExclusive: { type: "integer" },
      },
      required: ["cohortIndex", "lowerYear", "upperYearExclusive"],
    },
    ports: {
      inputs: [
        {
          id: "birthYear",
          label: "Birth Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "originYear",
          label: "Origin Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cohortWidth",
          label: "Cohort Width",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "cohortIndex",
          label: "Cohort Index",
          valueType: { type: "integer" },
        },
        {
          id: "lowerYear",
          label: "Lower Year",
          valueType: { type: "integer" },
        },
        {
          id: "upperYearExclusive",
          label: "Upper Year Exclusive",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = pensionStudyBirthCohortIndexTool.execute;
export default pensionStudyBirthCohortIndexTool;
