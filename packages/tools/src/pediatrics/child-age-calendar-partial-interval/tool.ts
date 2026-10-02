import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationDay: number;
  readonly birthEarliestDay: number;
  readonly birthLatestDay: number;
};
export type Output = {
  readonly ageLowerDays: number;
  readonly ageUpperDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationDay: { type: "integer" },
    birthEarliestDay: { type: "integer" },
    birthLatestDay: { type: "integer" },
  },
  required: ["observationDay", "birthEarliestDay", "birthLatestDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageLowerDays: { type: "integer" },
    ageUpperDays: { type: "integer" },
  },
  required: ["ageLowerDays", "ageUpperDays"],
} as const;
/** Propagate supplied absolute calendar-day birth bounds without approximating months or developmental age. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationDay, birthEarliestDay, birthLatestDay } = request;
  const compute = (): Output => {
    H.domain(
      birthEarliestDay <= birthLatestDay && birthLatestDay <= observationDay,
    );
    return {
      ageLowerDays: observationDay - birthLatestDay,
      ageUpperDays: observationDay - birthEarliestDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationDay: 1000, birthEarliestDay: 900, birthLatestDay: 910 },
  output: { ageLowerDays: 90, ageUpperDays: 100 },
} satisfies ToolExample<Input, Output>;
export const childAgeCalendarPartialIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pediatrics/child-age-calendar-partial-interval",
    title: "Child Age Calendar Partial Interval Tool",
    description:
      "Propagate supplied absolute calendar-day birth bounds without approximating months or developmental age.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationDay: { type: "integer" },
        birthEarliestDay: { type: "integer" },
        birthLatestDay: { type: "integer" },
      },
      required: ["observationDay", "birthEarliestDay", "birthLatestDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageLowerDays: { type: "integer" },
        ageUpperDays: { type: "integer" },
      },
      required: ["ageLowerDays", "ageUpperDays"],
    },
    ports: {
      inputs: [
        {
          id: "observationDay",
          label: "Observation Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "birthEarliestDay",
          label: "Birth Earliest Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "birthLatestDay",
          label: "Birth Latest Day",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "ageLowerDays",
          label: "Age Lower Days",
          valueType: { type: "integer" },
        },
        {
          id: "ageUpperDays",
          label: "Age Upper Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = childAgeCalendarPartialIntervalTool.execute;
export default childAgeCalendarPartialIntervalTool;
