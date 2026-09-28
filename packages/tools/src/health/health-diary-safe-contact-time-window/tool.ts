import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly minuteOfDay: number;
  readonly start: number;
  readonly end: number;
};
export type Output = {
  readonly inside: boolean;
  readonly wrapsMidnight: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minuteOfDay: { type: "integer", minimum: 0, maximum: 1439 },
    start: { type: "integer", minimum: 0, maximum: 1439 },
    end: { type: "integer", minimum: 0, maximum: 1439 },
  },
  required: ["minuteOfDay", "start", "end"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inside: { type: "boolean" },
    wrapsMidnight: { type: "boolean" },
  },
  required: ["inside", "wrapsMidnight"],
} as const;
/** Calculate health diary safe contact time window from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { minuteOfDay, start, end } = request;
  const compute = (): Output => {
    H.integer(minuteOfDay, 0, 1439);
    H.integer(start, 0, 1439);
    H.integer(end, 0, 1439);
    const wrapsMidnight = start > end;
    return {
      inside:
        start === end
          ? false
          : wrapsMidnight
            ? minuteOfDay >= start || minuteOfDay < end
            : minuteOfDay >= start && minuteOfDay < end,
      wrapsMidnight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { minuteOfDay: 60, start: 1320, end: 120 },
  output: { inside: true, wrapsMidnight: true },
} satisfies ToolExample<Input, Output>;
export const healthDiarySafeContactTimeWindowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/health-diary-safe-contact-time-window",
    title: "Health Diary Safe Contact Time Window Tool",
    description:
      "Calculate health diary safe contact time window from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minuteOfDay: { type: "integer", minimum: 0, maximum: 1439 },
        start: { type: "integer", minimum: 0, maximum: 1439 },
        end: { type: "integer", minimum: 0, maximum: 1439 },
      },
      required: ["minuteOfDay", "start", "end"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inside: { type: "boolean" },
        wrapsMidnight: { type: "boolean" },
      },
      required: ["inside", "wrapsMidnight"],
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
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "end",
          label: "End",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "inside", label: "Inside", valueType: { type: "boolean" } },
        {
          id: "wrapsMidnight",
          label: "Wraps Midnight",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = healthDiarySafeContactTimeWindowTool.execute;
export default healthDiarySafeContactTimeWindowTool;
