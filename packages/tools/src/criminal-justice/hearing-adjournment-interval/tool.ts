import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalDay: number;
  readonly rescheduledDay: number;
  readonly suppliedExcludedDays: number;
};
export type Output = {
  readonly calendarShift: number;
  readonly countedShift: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalDay: { type: "integer" },
    rescheduledDay: { type: "integer" },
    suppliedExcludedDays: { type: "integer", minimum: 0 },
  },
  required: ["originalDay", "rescheduledDay", "suppliedExcludedDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calendarShift: { type: "integer" },
    countedShift: { type: "integer" },
  },
  required: ["calendarShift", "countedShift"],
} as const;
/** Signed supplied hearing rescheduling arithmetic without selecting procedural deadlines. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalDay, rescheduledDay, suppliedExcludedDays } = request;
  const compute = (): Output => {
    H.integer(suppliedExcludedDays, 0);
    return {
      calendarShift: rescheduledDay - originalDay,
      countedShift: rescheduledDay - originalDay - suppliedExcludedDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalDay: 100, rescheduledDay: 120, suppliedExcludedDays: 2 },
  output: { calendarShift: 20, countedShift: 18 },
} satisfies ToolExample<Input, Output>;
export const hearingAdjournmentIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "criminal-justice/hearing-adjournment-interval",
    title: "Hearing Adjournment Interval Tool",
    description:
      "Signed supplied hearing rescheduling arithmetic without selecting procedural deadlines.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalDay: { type: "integer" },
        rescheduledDay: { type: "integer" },
        suppliedExcludedDays: { type: "integer", minimum: 0 },
      },
      required: ["originalDay", "rescheduledDay", "suppliedExcludedDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        calendarShift: { type: "integer" },
        countedShift: { type: "integer" },
      },
      required: ["calendarShift", "countedShift"],
    },
    ports: {
      inputs: [
        {
          id: "originalDay",
          label: "Original Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rescheduledDay",
          label: "Rescheduled Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedExcludedDays",
          label: "Supplied Excluded Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "calendarShift",
          label: "Calendar Shift",
          valueType: { type: "integer" },
        },
        {
          id: "countedShift",
          label: "Counted Shift",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = hearingAdjournmentIntervalTool.execute;
export default hearingAdjournmentIntervalTool;
