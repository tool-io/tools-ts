import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly attendeeIds: readonly string[] };
export type Output = {
  readonly uniqueAttendees: number;
  readonly repeatRecords: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attendeeIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["attendeeIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueAttendees: { type: "integer" },
    repeatRecords: { type: "integer" },
  },
  required: ["uniqueAttendees", "repeatRecords"],
} as const;
/** Count exact pseudonymous attendance repeats without identifying individuals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { attendeeIds } = request;
  const compute = (): Output => {
    return {
      uniqueAttendees: new Set(attendeeIds).size,
      repeatRecords: attendeeIds.length - new Set(attendeeIds).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { attendeeIds: ["a", "b", "a", "a"] },
  output: { uniqueAttendees: 2, repeatRecords: 2 },
} satisfies ToolExample<Input, Output>;
export const fieldDayAttendanceRepeatCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-extension/field-day-attendance-repeat-count",
    title: "Field Day Attendance Repeat Count Tool",
    description:
      "Count exact pseudonymous attendance repeats without identifying individuals.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        attendeeIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["attendeeIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueAttendees: { type: "integer" },
        repeatRecords: { type: "integer" },
      },
      required: ["uniqueAttendees", "repeatRecords"],
    },
    ports: {
      inputs: [
        {
          id: "attendeeIds",
          label: "Attendee Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "uniqueAttendees",
          label: "Unique Attendees",
          valueType: { type: "integer" },
        },
        {
          id: "repeatRecords",
          label: "Repeat Records",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = fieldDayAttendanceRepeatCountTool.execute;
export default fieldDayAttendanceRepeatCountTool;
