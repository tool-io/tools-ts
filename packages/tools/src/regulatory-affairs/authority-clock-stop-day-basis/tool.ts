import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly calendarElapsed: number;
  readonly suppliedBusinessElapsed: number;
  readonly stoppedCalendar: number;
  readonly stoppedBusiness: number;
  readonly useBusiness: boolean;
};
export type Output = {
  readonly countedDays: number;
  readonly stopCredit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calendarElapsed: { type: "integer", minimum: 0 },
    suppliedBusinessElapsed: { type: "integer", minimum: 0 },
    stoppedCalendar: { type: "integer", minimum: 0 },
    stoppedBusiness: { type: "integer", minimum: 0 },
    useBusiness: { type: "boolean" },
  },
  required: [
    "calendarElapsed",
    "suppliedBusinessElapsed",
    "stoppedCalendar",
    "stoppedBusiness",
    "useBusiness",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedDays: { type: "integer" },
    stopCredit: { type: "integer" },
  },
  required: ["countedDays", "stopCredit"],
} as const;
/** Apply already resolved calendar/business clock-stop counts without interpreting agency timelines. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    calendarElapsed,
    suppliedBusinessElapsed,
    stoppedCalendar,
    stoppedBusiness,
    useBusiness,
  } = request;
  const compute = (): Output => {
    H.integer(calendarElapsed, 0);
    H.integer(suppliedBusinessElapsed, 0, calendarElapsed);
    H.integer(stoppedCalendar, 0, calendarElapsed);
    H.integer(
      stoppedBusiness,
      0,
      Math.min(stoppedCalendar, suppliedBusinessElapsed),
    );
    return {
      countedDays: useBusiness
        ? suppliedBusinessElapsed - stoppedBusiness
        : calendarElapsed - stoppedCalendar,
      stopCredit: useBusiness ? stoppedBusiness : stoppedCalendar,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    calendarElapsed: 20,
    suppliedBusinessElapsed: 14,
    stoppedCalendar: 5,
    stoppedBusiness: 3,
    useBusiness: true,
  },
  output: { countedDays: 11, stopCredit: 3 },
} satisfies ToolExample<Input, Output>;
export const authorityClockStopDayBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "regulatory-affairs/authority-clock-stop-day-basis",
    title: "Authority Clock Stop Day Basis Tool",
    description:
      "Apply already resolved calendar/business clock-stop counts without interpreting agency timelines.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        calendarElapsed: { type: "integer", minimum: 0 },
        suppliedBusinessElapsed: { type: "integer", minimum: 0 },
        stoppedCalendar: { type: "integer", minimum: 0 },
        stoppedBusiness: { type: "integer", minimum: 0 },
        useBusiness: { type: "boolean" },
      },
      required: [
        "calendarElapsed",
        "suppliedBusinessElapsed",
        "stoppedCalendar",
        "stoppedBusiness",
        "useBusiness",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedDays: { type: "integer" },
        stopCredit: { type: "integer" },
      },
      required: ["countedDays", "stopCredit"],
    },
    ports: {
      inputs: [
        {
          id: "calendarElapsed",
          label: "Calendar Elapsed",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedBusinessElapsed",
          label: "Supplied Business Elapsed",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "stoppedCalendar",
          label: "Stopped Calendar",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "stoppedBusiness",
          label: "Stopped Business",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "useBusiness",
          label: "Use Business",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "countedDays",
          label: "Counted Days",
          valueType: { type: "integer" },
        },
        {
          id: "stopCredit",
          label: "Stop Credit",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = authorityClockStopDayBasisTool.execute;
export default authorityClockStopDayBasisTool;
