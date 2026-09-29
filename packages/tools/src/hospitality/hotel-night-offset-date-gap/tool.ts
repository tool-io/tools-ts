import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly checkInDay: number;
  readonly checkOutDay: number;
  readonly billedNights: number;
  readonly dayUseCount: number;
};
export type Output = {
  readonly calendarNights: number;
  readonly billingGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    checkInDay: { type: "integer" },
    checkOutDay: { type: "integer" },
    billedNights: { type: "integer", minimum: 0 },
    dayUseCount: { type: "integer", minimum: 0 },
  },
  required: ["checkInDay", "checkOutDay", "billedNights", "dayUseCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calendarNights: { type: "integer" },
    billingGap: { type: "integer" },
  },
  required: ["calendarNights", "billingGap"],
} as const;
/** Reconcile caller-defined hotel night and day-use counts using explicit day indices. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { checkInDay, checkOutDay, billedNights, dayUseCount } = request;
  const compute = (): Output => {
    H.domain(checkOutDay >= checkInDay);
    H.integer(billedNights, 0);
    H.integer(dayUseCount, 0);
    return {
      calendarNights: checkOutDay - checkInDay,
      billingGap: billedNights - (checkOutDay - checkInDay) - dayUseCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { checkInDay: 100, checkOutDay: 103, billedNights: 4, dayUseCount: 1 },
  output: { calendarNights: 3, billingGap: 0 },
} satisfies ToolExample<Input, Output>;
export const hotelNightOffsetDateGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/hotel-night-offset-date-gap",
    title: "Hotel Night Offset Date Gap Tool",
    description:
      "Reconcile caller-defined hotel night and day-use counts using explicit day indices.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        checkInDay: { type: "integer" },
        checkOutDay: { type: "integer" },
        billedNights: { type: "integer", minimum: 0 },
        dayUseCount: { type: "integer", minimum: 0 },
      },
      required: ["checkInDay", "checkOutDay", "billedNights", "dayUseCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        calendarNights: { type: "integer" },
        billingGap: { type: "integer" },
      },
      required: ["calendarNights", "billingGap"],
    },
    ports: {
      inputs: [
        {
          id: "checkInDay",
          label: "Check In Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "checkOutDay",
          label: "Check Out Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "billedNights",
          label: "Billed Nights",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "dayUseCount",
          label: "Day Use Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "calendarNights",
          label: "Calendar Nights",
          valueType: { type: "integer" },
        },
        {
          id: "billingGap",
          label: "Billing Gap",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = hotelNightOffsetDateGapTool.execute;
export default hotelNightOffsetDateGapTool;
