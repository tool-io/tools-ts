import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dayIndex: number;
  readonly minuteOfDay: number;
  readonly sourceOffsetMinutes: number;
  readonly targetOffsetMinutes: number;
};
export type Output = {
  readonly dayIndex: number;
  readonly minuteOfDay: number;
  readonly dayCarry: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dayIndex: { type: "integer" },
    minuteOfDay: { type: "integer", minimum: 0, maximum: 1439 },
    sourceOffsetMinutes: { type: "integer", minimum: -1439, maximum: 1439 },
    targetOffsetMinutes: { type: "integer", minimum: -1439, maximum: 1439 },
  },
  required: [
    "dayIndex",
    "minuteOfDay",
    "sourceOffsetMinutes",
    "targetOffsetMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dayIndex: { type: "integer" },
    minuteOfDay: { type: "integer" },
    dayCarry: { type: "integer" },
  },
  required: ["dayIndex", "minuteOfDay", "dayCarry"],
} as const;
/** Translate supplied day/minute records between explicit fixed UTC offsets. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dayIndex, minuteOfDay, sourceOffsetMinutes, targetOffsetMinutes } =
    request;
  const compute = (): Output => {
    H.integer(minuteOfDay, 0, 1439);
    H.integer(sourceOffsetMinutes, -1439, 1439);
    H.integer(targetOffsetMinutes, -1439, 1439);
    const shifted = minuteOfDay - sourceOffsetMinutes + targetOffsetMinutes,
      dayCarry = Math.floor(shifted / 1440);
    return {
      dayIndex: dayIndex + dayCarry,
      minuteOfDay: shifted - dayCarry * 1440,
      dayCarry,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dayIndex: 100,
    minuteOfDay: 1380,
    sourceOffsetMinutes: 0,
    targetOffsetMinutes: 120,
  },
  output: { dayIndex: 101, minuteOfDay: 60, dayCarry: 1 },
} satisfies ToolExample<Input, Output>;
export const birthRecordFixedOffsetDateCarryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "obstetrics/birth-record-fixed-offset-date-carry",
    title: "Birth Record Fixed Offset Date Carry Tool",
    description:
      "Translate supplied day/minute records between explicit fixed UTC offsets.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dayIndex: { type: "integer" },
        minuteOfDay: { type: "integer", minimum: 0, maximum: 1439 },
        sourceOffsetMinutes: { type: "integer", minimum: -1439, maximum: 1439 },
        targetOffsetMinutes: { type: "integer", minimum: -1439, maximum: 1439 },
      },
      required: [
        "dayIndex",
        "minuteOfDay",
        "sourceOffsetMinutes",
        "targetOffsetMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dayIndex: { type: "integer" },
        minuteOfDay: { type: "integer" },
        dayCarry: { type: "integer" },
      },
      required: ["dayIndex", "minuteOfDay", "dayCarry"],
    },
    ports: {
      inputs: [
        {
          id: "dayIndex",
          label: "Day Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "minuteOfDay",
          label: "Minute Of Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sourceOffsetMinutes",
          label: "Source Offset Minutes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetOffsetMinutes",
          label: "Target Offset Minutes",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "dayIndex", label: "Day Index", valueType: { type: "integer" } },
        {
          id: "minuteOfDay",
          label: "Minute Of Day",
          valueType: { type: "integer" },
        },
        { id: "dayCarry", label: "Day Carry", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = birthRecordFixedOffsetDateCarryTool.execute;
export default birthRecordFixedOffsetDateCarryTool;
