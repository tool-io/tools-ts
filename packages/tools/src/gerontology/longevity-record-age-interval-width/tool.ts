import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earliestBirthDay: number;
  readonly latestBirthDay: number;
  readonly observationDay: number;
  readonly daysPerYear: number;
};
export type Output = {
  readonly minimumAgeDays: number;
  readonly maximumAgeDays: number;
  readonly widthDays: number;
  readonly minimumAgeYears: number;
  readonly maximumAgeYears: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliestBirthDay: { type: "integer" },
    latestBirthDay: { type: "integer" },
    observationDay: { type: "integer" },
    daysPerYear: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "earliestBirthDay",
    "latestBirthDay",
    "observationDay",
    "daysPerYear",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumAgeDays: { type: "integer" },
    maximumAgeDays: { type: "integer" },
    widthDays: { type: "integer" },
    minimumAgeYears: { type: "number" },
    maximumAgeYears: { type: "number" },
  },
  required: [
    "minimumAgeDays",
    "maximumAgeDays",
    "widthDays",
    "minimumAgeYears",
    "maximumAgeYears",
  ],
} as const;
/** Age interval from uncertain birth-day bounds; year fractions use an explicit denominator and are not completed calendar-year ages. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earliestBirthDay, latestBirthDay, observationDay, daysPerYear } =
    request;
  const compute = (): Output => {
    H.domain(
      latestBirthDay >= earliestBirthDay && observationDay >= latestBirthDay,
    );
    H.positive(daysPerYear);
    return {
      minimumAgeDays: observationDay - latestBirthDay,
      maximumAgeDays: observationDay - earliestBirthDay,
      widthDays: latestBirthDay - earliestBirthDay,
      minimumAgeYears: (observationDay - latestBirthDay) / daysPerYear,
      maximumAgeYears: (observationDay - earliestBirthDay) / daysPerYear,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    earliestBirthDay: 1000,
    latestBirthDay: 1030,
    observationDay: 37500,
    daysPerYear: 365,
  },
  output: {
    minimumAgeDays: 36470,
    maximumAgeDays: 36500,
    widthDays: 30,
    minimumAgeYears: 99.91780821917808,
    maximumAgeYears: 100,
  },
} satisfies ToolExample<Input, Output>;
export const longevityRecordAgeIntervalWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/longevity-record-age-interval-width",
    title: "Longevity Record Age Interval Width Tool",
    description:
      "Age interval from uncertain birth-day bounds; year fractions use an explicit denominator and are not completed calendar-year ages.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliestBirthDay: { type: "integer" },
        latestBirthDay: { type: "integer" },
        observationDay: { type: "integer" },
        daysPerYear: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "earliestBirthDay",
        "latestBirthDay",
        "observationDay",
        "daysPerYear",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimumAgeDays: { type: "integer" },
        maximumAgeDays: { type: "integer" },
        widthDays: { type: "integer" },
        minimumAgeYears: { type: "number" },
        maximumAgeYears: { type: "number" },
      },
      required: [
        "minimumAgeDays",
        "maximumAgeDays",
        "widthDays",
        "minimumAgeYears",
        "maximumAgeYears",
      ],
    },
    ports: {
      inputs: [
        {
          id: "earliestBirthDay",
          label: "Earliest Birth Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "latestBirthDay",
          label: "Latest Birth Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observationDay",
          label: "Observation Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "daysPerYear",
          label: "Days Per Year",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "minimumAgeDays",
          label: "Minimum Age Days",
          valueType: { type: "integer" },
        },
        {
          id: "maximumAgeDays",
          label: "Maximum Age Days",
          valueType: { type: "integer" },
        },
        {
          id: "widthDays",
          label: "Width Days",
          valueType: { type: "integer" },
        },
        {
          id: "minimumAgeYears",
          label: "Minimum Age Years",
          valueType: { type: "number" },
        },
        {
          id: "maximumAgeYears",
          label: "Maximum Age Years",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = longevityRecordAgeIntervalWidthTool.execute;
export default longevityRecordAgeIntervalWidthTool;
