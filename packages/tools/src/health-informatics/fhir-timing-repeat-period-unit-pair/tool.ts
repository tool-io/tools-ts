import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly period: number; readonly unit: string };
export type Output = {
  readonly fixedDuration: boolean;
  readonly seconds: number;
  readonly calendarMonths: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    period: { type: "number", exclusiveMinimum: 0 },
    unit: {
      type: "string",
      maxLength: 8192,
      enum: ["s", "min", "h", "d", "wk", "mo", "a"],
    },
  },
  required: ["period", "unit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fixedDuration: { type: "boolean" },
    seconds: { type: "number" },
    calendarMonths: { type: "number" },
  },
  required: ["fixedDuration", "seconds", "calendarMonths"],
} as const;
/** Convert fixed FHIR timing periods to seconds and calendar periods to months, leaving the unused representation zero rather than inventing fixed month/year lengths. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { period, unit } = request;
  const compute = (): Output => {
    H.positive(period);
    H.domain(["s", "min", "h", "d", "wk", "mo", "a"].includes(unit));
    return {
      fixedDuration: unit !== "mo" && unit !== "a",
      seconds:
        period *
        (unit === "s"
          ? 1
          : unit === "min"
            ? 60
            : unit === "h"
              ? 3600
              : unit === "d"
                ? 86400
                : unit === "wk"
                  ? 604800
                  : 0),
      calendarMonths: unit === "mo" ? period : unit === "a" ? 12 * period : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { period: 2, unit: "wk" },
  output: { fixedDuration: true, seconds: 1209600, calendarMonths: 0 },
} satisfies ToolExample<Input, Output>;
export const fhirTimingRepeatPeriodUnitPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/fhir-timing-repeat-period-unit-pair",
    title: "FHIR Timing Repeat Period Unit Pair Tool",
    description:
      "Convert fixed FHIR timing periods to seconds and calendar periods to months, leaving the unused representation zero rather than inventing fixed month/year lengths.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        period: { type: "number", exclusiveMinimum: 0 },
        unit: {
          type: "string",
          maxLength: 8192,
          enum: ["s", "min", "h", "d", "wk", "mo", "a"],
        },
      },
      required: ["period", "unit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fixedDuration: { type: "boolean" },
        seconds: { type: "number" },
        calendarMonths: { type: "number" },
      },
      required: ["fixedDuration", "seconds", "calendarMonths"],
    },
    ports: {
      inputs: [
        {
          id: "period",
          label: "Period",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "fixedDuration",
          label: "Fixed Duration",
          valueType: { type: "boolean" },
        },
        { id: "seconds", label: "Seconds", valueType: { type: "number" } },
        {
          id: "calendarMonths",
          label: "Calendar Months",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fhirTimingRepeatPeriodUnitPairTool.execute;
export default fhirTimingRepeatPeriodUnitPairTool;
