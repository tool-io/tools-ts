import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedTime: number;
  readonly suppliedDayStart: number;
  readonly suppliedDayLength: number;
};
export type Output = { readonly dayIndex: number; readonly withinDay: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedTime: { type: "number" },
    suppliedDayStart: { type: "number" },
    suppliedDayLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["recordedTime", "suppliedDayStart", "suppliedDayLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dayIndex: { type: "integer" }, withinDay: { type: "number" } },
  required: ["dayIndex", "withinDay"],
} as const;
/** Map a supplied clock onto an explicit fixed-length day-origin convention without calculating sunset or religious observances. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedTime, suppliedDayStart, suppliedDayLength } = request;
  const compute = (): Output => {
    H.positive(suppliedDayLength);
    return {
      dayIndex: Math.floor(
        (recordedTime - suppliedDayStart) / suppliedDayLength,
      ),
      withinDay:
        (recordedTime - suppliedDayStart) % suppliedDayLength < 0
          ? ((recordedTime - suppliedDayStart) % suppliedDayLength) +
            suppliedDayLength
          : (recordedTime - suppliedDayStart) % suppliedDayLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedTime: 30, suppliedDayStart: 6, suppliedDayLength: 24 },
  output: { dayIndex: 1, withinDay: 0 },
} satisfies ToolExample<Input, Output>;
export const publicCalendarDayStartOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/public-calendar-day-start-offset",
    title: "Public Calendar Day Start Offset Tool",
    description:
      "Map a supplied clock onto an explicit fixed-length day-origin convention without calculating sunset or religious observances.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedTime: { type: "number" },
        suppliedDayStart: { type: "number" },
        suppliedDayLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["recordedTime", "suppliedDayStart", "suppliedDayLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dayIndex: { type: "integer" },
        withinDay: { type: "number" },
      },
      required: ["dayIndex", "withinDay"],
    },
    ports: {
      inputs: [
        {
          id: "recordedTime",
          label: "Recorded Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDayStart",
          label: "Supplied Day Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDayLength",
          label: "Supplied Day Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dayIndex", label: "Day Index", valueType: { type: "integer" } },
        { id: "withinDay", label: "Within Day", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = publicCalendarDayStartOffsetTool.execute;
export default publicCalendarDayStartOffsetTool;
