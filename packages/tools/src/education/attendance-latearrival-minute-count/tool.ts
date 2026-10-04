import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduledStartMinute: number;
  readonly actualArrivalMinute: number;
};
export type Output = {
  readonly lateMinutes: number;
  readonly earlyMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduledStartMinute: { type: "integer", minimum: 0 },
    actualArrivalMinute: { type: "integer", minimum: 0 },
  },
  required: ["scheduledStartMinute", "actualArrivalMinute"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lateMinutes: { type: "integer" },
    earlyMinutes: { type: "integer" },
  },
  required: ["lateMinutes", "earlyMinutes"],
} as const;
/** Record late or early arrival minutes on a shared school-day timeline without applying attendance sanctions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduledStartMinute, actualArrivalMinute } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(scheduledStartMinute) &&
        scheduledStartMinute >= 0 &&
        scheduledStartMinute <= Number.MAX_SAFE_INTEGER,
      "scheduledStartMinute",
    ),
      scheduledStartMinute);
    (H.domain(
      Number.isSafeInteger(actualArrivalMinute) &&
        actualArrivalMinute >= 0 &&
        actualArrivalMinute <= Number.MAX_SAFE_INTEGER,
      "actualArrivalMinute",
    ),
      actualArrivalMinute);
    return {
      lateMinutes: Math.max(0, actualArrivalMinute - scheduledStartMinute),
      earlyMinutes: Math.max(0, scheduledStartMinute - actualArrivalMinute),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scheduledStartMinute: 540, actualArrivalMinute: 547 },
  output: { lateMinutes: 7, earlyMinutes: 0 },
} satisfies ToolExample<Input, Output>;
export const attendanceLatearrivalMinuteCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/attendance-latearrival-minute-count",
    title: "Attendance Latearrival Minute Count Tool",
    description:
      "Record late or early arrival minutes on a shared school-day timeline without applying attendance sanctions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduledStartMinute: { type: "integer", minimum: 0 },
        actualArrivalMinute: { type: "integer", minimum: 0 },
      },
      required: ["scheduledStartMinute", "actualArrivalMinute"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lateMinutes: { type: "integer" },
        earlyMinutes: { type: "integer" },
      },
      required: ["lateMinutes", "earlyMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "scheduledStartMinute",
          label: "Scheduled Start Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "actualArrivalMinute",
          label: "Actual Arrival Minute",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "lateMinutes",
          label: "Late Minutes",
          valueType: { type: "integer" },
        },
        {
          id: "earlyMinutes",
          label: "Early Minutes",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = attendanceLatearrivalMinuteCountTool.execute;
export default attendanceLatearrivalMinuteCountTool;
