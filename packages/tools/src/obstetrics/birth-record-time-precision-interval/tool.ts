import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly minuteOfDay: number;
  readonly precisionMinutes: number;
  readonly rounded: boolean;
};
export type Output = {
  readonly earliestMinute: number;
  readonly latestMinuteExclusive: number;
  readonly crossesDay: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minuteOfDay: { type: "integer", minimum: 0, maximum: 1439 },
    precisionMinutes: { type: "integer", minimum: 1, maximum: 1440 },
    rounded: { type: "boolean" },
  },
  required: ["minuteOfDay", "precisionMinutes", "rounded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliestMinute: { type: "number" },
    latestMinuteExclusive: { type: "number" },
    crossesDay: { type: "boolean" },
  },
  required: ["earliestMinute", "latestMinuteExclusive", "crossesDay"],
} as const;
/** Construct an envelope from an explicitly rounded or truncated minute record. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { minuteOfDay, precisionMinutes, rounded } = request;
  const compute = (): Output => {
    H.integer(minuteOfDay, 0, 1439);
    H.integer(precisionMinutes, 1, 1440);
    return {
      earliestMinute: rounded
        ? minuteOfDay - precisionMinutes / 2
        : minuteOfDay,
      latestMinuteExclusive: rounded
        ? minuteOfDay + precisionMinutes / 2
        : minuteOfDay + precisionMinutes,
      crossesDay:
        (rounded ? minuteOfDay - precisionMinutes / 2 : minuteOfDay) < 0 ||
        (rounded
          ? minuteOfDay + precisionMinutes / 2
          : minuteOfDay + precisionMinutes) > 1440,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { minuteOfDay: 600, precisionMinutes: 10, rounded: true },
  output: {
    earliestMinute: 595,
    latestMinuteExclusive: 605,
    crossesDay: false,
  },
} satisfies ToolExample<Input, Output>;
export const birthRecordTimePrecisionIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "obstetrics/birth-record-time-precision-interval",
    title: "Birth Record Time Precision Interval Tool",
    description:
      "Construct an envelope from an explicitly rounded or truncated minute record.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minuteOfDay: { type: "integer", minimum: 0, maximum: 1439 },
        precisionMinutes: { type: "integer", minimum: 1, maximum: 1440 },
        rounded: { type: "boolean" },
      },
      required: ["minuteOfDay", "precisionMinutes", "rounded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliestMinute: { type: "number" },
        latestMinuteExclusive: { type: "number" },
        crossesDay: { type: "boolean" },
      },
      required: ["earliestMinute", "latestMinuteExclusive", "crossesDay"],
    },
    ports: {
      inputs: [
        {
          id: "minuteOfDay",
          label: "Minute Of Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "precisionMinutes",
          label: "Precision Minutes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rounded",
          label: "Rounded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "earliestMinute",
          label: "Earliest Minute",
          valueType: { type: "number" },
        },
        {
          id: "latestMinuteExclusive",
          label: "Latest Minute Exclusive",
          valueType: { type: "number" },
        },
        {
          id: "crossesDay",
          label: "Crosses Day",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = birthRecordTimePrecisionIntervalTool.execute;
export default birthRecordTimePrecisionIntervalTool;
