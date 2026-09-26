import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly events: number;
  readonly personDays: number;
  readonly daysPerYear: number;
  readonly rateBase: number;
};
export type Output = {
  readonly personYears: number;
  readonly ratePerBaseYears: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    events: { type: "integer", minimum: 0 },
    personDays: { type: "number", exclusiveMinimum: 0 },
    daysPerYear: { type: "number", exclusiveMinimum: 0 },
    rateBase: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["events", "personDays", "daysPerYear", "rateBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personYears: { type: "number" },
    ratePerBaseYears: { type: "number" },
  },
  required: ["personYears", "ratePerBaseYears"],
} as const;
/** Incidence density from explicitly supplied person-time; no assumption that events equal affected people. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { events, personDays, daysPerYear, rateBase } = request;
  const compute = (): Output => {
    H.integer(events, 0);
    H.positive(personDays);
    H.positive(daysPerYear);
    H.positive(rateBase);
    return {
      personYears: personDays / daysPerYear,
      ratePerBaseYears: (events * daysPerYear * rateBase) / personDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { events: 10, personDays: 36500, daysPerYear: 365, rateBase: 1000 },
  output: { personYears: 100, ratePerBaseYears: 100 },
} satisfies ToolExample<Input, Output>;
export const incidenceDensityExposureDayFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/incidence-density-exposure-day-factor",
    title: "Incidence Density Exposure Day Factor Tool",
    description:
      "Incidence density from explicitly supplied person-time; no assumption that events equal affected people.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        events: { type: "integer", minimum: 0 },
        personDays: { type: "number", exclusiveMinimum: 0 },
        daysPerYear: { type: "number", exclusiveMinimum: 0 },
        rateBase: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["events", "personDays", "daysPerYear", "rateBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personYears: { type: "number" },
        ratePerBaseYears: { type: "number" },
      },
      required: ["personYears", "ratePerBaseYears"],
    },
    ports: {
      inputs: [
        {
          id: "events",
          label: "Events",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "personDays",
          label: "Person Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "daysPerYear",
          label: "Days Per Year",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rateBase",
          label: "Rate Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "personYears",
          label: "Person Years",
          valueType: { type: "number" },
        },
        {
          id: "ratePerBaseYears",
          label: "Rate Per Base Years",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = incidenceDensityExposureDayFactorTool.execute;
export default incidenceDensityExposureDayFactorTool;
